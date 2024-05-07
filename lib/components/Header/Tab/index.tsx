import { h } from 'preact';
import { memo, useState } from 'preact/compat';

import useStore from 'lib/store';

import { CloseTabIcon } from 'lib/components/Icons';
import { Close, Container, Group, Title } from './styles';
import Popover from '../Popover';

const Tab: React.FC<TabProps> = ({ title, isCurrent, onSelect, onClose }) => {
  const [transition, setTransition] = useState<boolean>(true);

  const handleSelect = () => {
    onSelect();

    window.send('window:set-title', title);
  };

  const handleClose = () => {
    setTransition(false);

    setTimeout(() => {
      setTransition(true);

      onClose();
    }, 150);
  };

  return (
    <Container
      $isCurrent={isCurrent}
      $transition={transition}
      onClick={handleSelect}
    >
      <Title title={title}>{title}</Title>
      <Close onClick={handleClose}>
        <CloseTabIcon />
        <Popover label={`Close ${title === 'Settings' ? title : 'Terminal'}`} />
      </Close>
    </Container>
  );
};

const TabGroup: React.FC = () => {
  const { context, current, onSelect, onClose } = useStore();

  return (
    <Group role="group">
      {Object.keys(context).map((id, index) => {
        const { title } = context[id];

        const props: TabProps = {
          title,
          isCurrent: id === current,
          onSelect: onSelect.bind(null, id),
          onClose: onClose.bind(null, id),
        };

        return <Tab {...props} key={index} />;
      })}
    </Group>
  );
};

export default memo(TabGroup);
