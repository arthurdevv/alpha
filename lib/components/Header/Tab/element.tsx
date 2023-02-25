import { h } from 'preact';
import { memo } from 'preact/compat';

import { Container, Label, CloseButton } from './styles';
import { CloseTabIcon } from '../../Icon';
import Popover from '../Popover';

const Tab: React.FC<TabProps> = (props: TabProps) => {
  const { title, isCurrent, onSelect, onClose } = props;

  return (
    <Container className={isCurrent ? 'current' : undefined} onClick={onSelect}>
      <Label title={title}>{title}</Label>
      <CloseButton onClick={onClose}>
        <CloseTabIcon />
        <Popover label="Close Terminal" />
      </CloseButton>
    </Container>
  );
};

export default memo(Tab);
