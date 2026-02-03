import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { unlink } from 'fs';
import { firstRunFlag, firstRunFlagPath } from 'app/settings/constants';
import storage from 'app/utils/local-storage';
import { reportError } from 'shared/error-reporter';
import { onSearch, sortArray } from '.';

export function useSuggestions(modal: string | null, match: string) {
  const matchRef = useRef<string>(match);

  const suggestions: string[] = storage.parseItem('suggestions')[modal!] || [];

  const suggestion = useMemo(() => {
    if (!match) return '';

    const value = suggestions.find(s => s.startsWith(match) && s !== match);

    return value ?? '';
  }, [match]);

  const handleComplete = (event: KeyboardEvent, callback: Function) => {
    if (event.key === 'Tab') {
      event.preventDefault();

      suggestion && callback(suggestion);
    }
  };

  const saveSuggestion = () => {
    const match = matchRef.current;

    if (match && !suggestions.includes(match)) suggestions.push(match);

    storage.updateItem('suggestions', { [modal!]: suggestions }, true);
  };

  useEffect(() => {
    matchRef.current = match;
  }, [match]);

  return { suggestion, handleComplete, saveSuggestion };
}

export function useSearchFilter(modal: string | null, props: ModalProps) {
  const [search, setSearch] = useState('');

  const { suggestion, saveSuggestion } = useSuggestions(modal, search);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event, 'block', setSearch);
  };

  const handleComplete = (event: KeyboardEvent) => {
    if (event.key === 'Tab' && suggestion) {
      event.preventDefault();

      setSearch(suggestion);

      (event as any).currentTarget.value = suggestion;
      onSearch(event);
    }
  };

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { current } = ref;

    if (current) setTimeout(() => current.focus(), 100);

    return () => {
      if (global.shouldSelectProfile) delete global.shouldSelectProfile;
    };
  }, [props.isVisible]);

  return {
    ref,
    search,
    suggestion,
    handleSearch,
    handleComplete,
    saveSuggestion,
  };
}

export function useContextMenu(
  props: ModalProps,
): [
  React.MutableRefObject<HTMLDivElement | null>,
  { top: number; left: number },
  boolean,
  [boolean, React.Dispatch<React.SetStateAction<boolean>>],
  typeof storage,
  TFunction<'translation', undefined>,
] {
  const ref = useRef<HTMLDivElement | null>(null);

  const [position, setPosition] = useState({ top: 0, left: 0 });

  const [isExtended, setExtended] = useState<boolean>(false);

  const { t } = useTranslation();

  useEffect(() => {
    const isExtended = storage.parseItem('contextmenu', false);

    setExtended(isExtended);

    const handleModalVisiblity = ({ target }: MouseEvent) => {
      const { current } = ref;

      current && !current.contains(target as Node) && props.handleModal();
    };

    document.addEventListener('mousedown', handleModalVisiblity);

    return () => {
      document.removeEventListener('mousedown', handleModalVisiblity);
    };
  }, []);

  useEffect(() => {
    const { current } = ref;

    if (current) {
      const { width, height } = current.getBoundingClientRect();

      let { top, left } = global.menu!;

      if (top + height > window.innerHeight) top -= height;
      if (left + width > window.innerWidth) left -= width;

      setPosition({ top, left });
    }

    return () => setPosition({ top: 0, left: 0 });
  }, [props]);

  const isMinimal = props.store.options.contextMenuStyle === 'minimal';

  return [ref, position, isMinimal, [isExtended, setExtended], storage, t];
}

export function useKeyboardIndex(
  length: number,
  onEnter?: (index: number) => void,
): [number, React.Dispatch<React.SetStateAction<number>>] {
  const [index, setIndex] = useState<number>(0);

  const indexRef = useRef<number>(index);

  useEffect(() => {
    function handleKeyDown({ key }: KeyboardEvent) {
      if (key === 'ArrowDown') {
        setIndex(prev => {
          const next = prev + 1;

          return next >= length ? 0 : next;
        });
      }

      if (key === 'ArrowUp') {
        setIndex(prev => {
          const next = prev - 1;

          return next < 0 ? length - 1 : next;
        });
      }

      if (key === 'Enter') onEnter && onEnter(indexRef.current);
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [length]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  return [index, setIndex];
}

export function useFirstRun(): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
] {
  const [isFirstRun, setIsFirstRun] = useState(firstRunFlag);

  useEffect(() => {
    if (!isFirstRun) return;

    unlink(firstRunFlagPath, error => error && reportError(error));
  }, [isFirstRun]);

  return [isFirstRun, setIsFirstRun];
}

export { sortArray };
