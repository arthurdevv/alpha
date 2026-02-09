import { memo, useRef, useEffect } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import storage from 'app/utils/local-storage';
import styles from './styles.module.css';

const COLORS = [
  { name: 'None', value: '' },
  { name: 'Red', value: '#e74c3c' },
  { name: 'Orange', value: '#e67e22' },
  { name: 'Yellow', value: '#f1c40f' },
  { name: 'Green', value: '#2ecc71' },
  { name: 'Cyan', value: '#1abc9c' },
  { name: 'Blue', value: '#3498db' },
  { name: 'Purple', value: '#9b59b6' },
  { name: 'Pink', value: '#e91e63' },
];

const ColorPicker: React.FC<ModalProps> = ({ isVisible, handleModal }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const tabId = global.id || '';

  const handleSelect = (color: string) => {
    if (!tabId) return;

    const tabColors = storage.parseItem('tabColors') || {};

    if (color) {
      tabColors[tabId] = color;
    } else {
      delete tabColors[tabId];
    }

    storage.updateItem('tabColors', tabColors);
    window.dispatchEvent(new CustomEvent('tabColorChange'));
    handleModal();
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      handleModal();
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible]);

  const currentColor = tabId ? (storage.parseItem('tabColors') || {})[tabId] || '' : '';

  return (
    <div
      ref={ref}
      className={`${styles.container} ${isVisible ? styles.visible : ''}`}
      style={global.menu || {}}
    >
      <div className={styles.title}>{t('Tab color')}</div>
      <div className={styles.colors}>
        {COLORS.map(({ name, value }) => (
          <button
            key={name}
            className={`${styles.color} ${currentColor === value ? styles.selected : ''}`}
            style={value ? { background: value } : {}}
            onClick={() => handleSelect(value)}
            title={t(name)}
          >
            {!value && <span className={styles.none}>x</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(ColorPicker);
