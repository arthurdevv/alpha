import { useEffect, useRef, useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import storage from 'app/utils/local-storage';

function useContextMenu(
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

export { useContextMenu };
