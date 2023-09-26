import { h } from 'preact';
import { memo } from 'preact/compat';

import useStore from 'lib/store';

import { Group, Container, Label, CloseButton } from './styles';
import { CloseTabIcon } from '../../Icon';
import Popover from '../Popover';

const Tab: React.FC<TabProps> = (props: TabProps) => {
  const { title, isCurrent, onSelect, onClose } = props;

  return (
    <Container $isCurrent={isCurrent} onClick={onSelect}>
      <Label title={title}>{title}</Label>
      <CloseButton onClick={onClose}>
        <CloseTabIcon />
        <Popover label={`Close ${title === 'Settings' ? title : 'Terminal'}`} />
      </CloseButton>
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
          title: title || 'Terminal',
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
