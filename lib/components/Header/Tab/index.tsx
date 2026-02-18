import { memo, useEffect, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { execCommand } from 'app/keymaps/commands';
import storage from 'app/utils/local-storage';
import useStore from 'lib/store';

import { CloseTabIcon, DotsIcon } from 'lib/components/Icons';
import { Action, Container, Group, Mask, Title } from './styles';
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
    <Group role="group">
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
    </Group>
  );
};

const Tab: React.FC<TabProps> = ({
  id,
  title,
  tabWidth,
  isCurrent,
  onClose,
  onSelect,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const [tabColor, setTabColor] = useState<string>(() => {
    const stored = storage.parseItem('tab-colors');

    return stored[id] || '#00000000';
  });

  const handleClick = (event: MouseEvent) => {
    const signal = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-signal]',
    )?.dataset.signal;

    switch (signal) {
      case 'MENU':
        return handleContextMenu(event);

      case 'SIGHUP':
        return setIsClosing(true);

      default:
        return execCommand('window:title', title, onSelect);
    }
  };

  const handleTransitionEnd = ({ target, currentTarget, propertyName }) => {
    if (target !== currentTarget || propertyName !== 'width') return;

    if (isClosing) onClose();
  };

  const handleContextMenu = (event: MouseEvent) => {
    global.id = id;
    global.menu = { top: event.clientY, left: event.clientX };
    global.handleModal(undefined, 'TabContextMenu', { on: 1, off: 1 });
  };

  useEffect(() => {
    const handleColorChange = () => {
      const colors = storage.parseItem('tab-colors');

      setTabColor(colors[id] || '#00000000');
    };

    window.addEventListener('tab:color', handleColorChange);

    return () => window.removeEventListener('tab:color', handleColorChange);
  }, [id]);

  return (
    <Container
      $isClosing={isClosing}
      $isCurrent={isCurrent}
      $tabWidth={tabWidth}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onTransitionEnd={handleTransitionEnd}
      className={isCurrent ? 'current' : undefined}
      style={{ '--indicator': tabColor }}
    >
      <Mask />
      <Title title={title}>{title}</Title>
      <Action data-signal="MENU" style={{ right: '1.875rem' }}>
        <DotsIcon />
      </Action>
      <Action data-signal="SIGHUP">
        <CloseTabIcon />
        <Popover label={`Close ${id !== 'Settings' ? 'tab' : 'settings'}`} />
      </Action>
    </Container>
  );
};

export default memo(TabGroup);
