import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import storage from 'app/utils/local-storage';
import { onSearch } from 'lib/utils';

function useSearch(modal: string | null, props: ModalProps) {
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

function useSuggestions(modal: string | null, match: string) {
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

function useKeyboardNavigation(
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

export { useSearch, useSuggestions, useKeyboardNavigation };
