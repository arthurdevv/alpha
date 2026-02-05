import { memo, useEffect, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { execCommand } from 'app/keymaps/commands';
import useStore from 'lib/store';

import storage from 'app/utils/local-storage';
import { CloseTabIcon, DotsIcon } from 'lib/components/Icons';
import styles from './styles.module.css';
import Popover from '../Popover';

const TabGroup: React.FC = () => {
  const {
    context,
    instances,
    current: { origin, terms },
    options: { tabWidth },
    onSelect,
    onClose,
  } = useStore();

  const { t } = useTranslation();

  return (
    <div className={styles.group} role="group">
      {Object.entries(context).map(([id, tab]) => {
        const [focused] = terms[id];

        let { title = 'Terminal' } = instances[focused] || {};

        title = tab.title || (/settings/i.test(id) ? t(title) : title);

        const props: TabProps = {
          id,
          title,
          tabWidth,
          isCurrent: id === origin,
          onSelect: onSelect.bind(null, id),
          onClose: onClose.bind(null, id),
        };

        return <Tab {...props} key={id} />;
      })}
    </div>
  );
};

const Tab: React.FC<TabProps> = (props: TabProps) => {
  const [transition, setTransition] = useState<boolean>(true);
  const [tabColor, setTabColor] = useState<string>(() => {
    const colors = storage.parseItem('tabColors') || {};
    return colors[props.id] || '';
  });

  useEffect(() => {
    const handleColorChange = () => {
      const colors = storage.parseItem('tabColors') || {};
      setTabColor(colors[props.id] || '');
    };

    window.addEventListener('tabColorChange', handleColorChange);
    return () => window.removeEventListener('tabColorChange', handleColorChange);
  }, [props.id]);

  const handleClick = (event: MouseEvent) => {
    const { signal } = (event.target as HTMLElement).dataset;

    switch (signal) {
      case 'MENU':
        return handleContextMenu(event);

      case 'SIGHUP': {
        setTransition(false);

        return setTimeout(() => {
          setTransition(true);

          props.onClose();
        }, 100);
      }

      default:
        return execCommand('window:title', title, props.onSelect);
    }
  };

  const handleContextMenu = (event: MouseEvent) => {
    global.id = id;
    global.menu = { top: event.clientY, left: event.clientX };
    global.handleModal(undefined, 'TabContextMenu', { on: 1, off: 1 });
  };

  const { id, title, tabWidth, isCurrent } = props;

  const containerClasses = [
    styles.container,
    isCurrent ? styles.containerCurrent : '',
    !transition ? styles.containerHidden : '',
    id !== 'Settings' ? styles.containerWithBefore : '',
    tabWidth === 'fixed' ? styles.containerFixed : styles.containerAuto,
    tabColor ? styles.containerColored : '',
  ].filter(Boolean).join(' ');

  const tabStyle = tabColor ? { '--indicator': tabColor } as React.CSSProperties : {};

  return (
    <div
      className={containerClasses}
      style={tabStyle}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <div className={styles.mask} />
      <span className={styles.title} title={title}>{title}</span>
      <div className={styles.action} data-signal="MENU" style={{ right: '1.875rem' }}>
        <DotsIcon />
      </div>
      <div className={styles.action} data-signal="SIGHUP">
        <CloseTabIcon />
        <Popover label={`Close ${id !== 'Settings' ? 'tab' : 'settings'}`} />
      </div>
    </div>
  );
};

export default memo(TabGroup);
