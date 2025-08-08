import { h } from 'preact';
import { memo, useState } from 'preact/compat';

import { execCommand } from 'app/keymaps/commands';
import useStore from 'lib/store';

import { CloseTabIcon } from 'lib/components/Icons';
import { Close, Container, Group, Title } from './styles';
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

  return (
    <Group role="group">
      {Object.keys(context).map(id => {
        const [focused] = terms[id];

        const { title } = instances[focused];

        const props: TabProps = {
          title,
          isCurrent: id === origin,
          onSelect: onSelect.bind(null, id),
          onClose: onClose.bind(null, id),
          tabWidth,
        };

        return <Tab {...props} key={id} />;
      })}
    </Group>
  );
};

const Tab: React.FC<TabProps> = (props: TabProps) => {
  const [transition, setTransition] = useState<boolean>(true);

  const handleSelect = ({ target }) => {
    const { signal } = target.dataset;

    if (signal !== 'SIGHUP') {
      execCommand('window:title', title).then(props.onSelect);
    }
  };

  const handleClose = () => {
    setTransition(false);

    setTimeout(() => {
      setTransition(true);

      props.onClose();
    }, 200);
  };

  const { title, isCurrent, tabWidth } = props;

  return (
    <Container
      $transition={transition}
      $isCurrent={isCurrent}
      $tabWidth={tabWidth}
      onClick={handleSelect}
    >
      <Title title={title}>{title}</Title>
      <Close data-signal="SIGHUP" onClick={handleClose}>
        <CloseTabIcon />
        <Popover label={`Close ${title === 'Settings' ? title : 'terminal'}`} />
      </Close>
    </Container>
  );
};

export default memo(TabGroup);
