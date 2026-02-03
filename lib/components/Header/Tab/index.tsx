import { memo, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { execCommand } from 'app/keymaps/commands';
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

const Tab: React.FC<TabProps> = (props: TabProps) => {
  const [transition, setTransition] = useState<boolean>(true);

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

  return (
    <Container
      $transition={transition}
      $isCurrent={isCurrent}
      $tabWidth={tabWidth}
      $before={id !== 'Settings'}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
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
