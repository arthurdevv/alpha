import { h } from 'preact';
import { memo } from 'preact/compat';

import getKeys from './keys';

import { Container, Content, Keys, KeyItem, Arrow } from './styles';

const Popover: React.FC<PopoverProps> = (props: PopoverProps) => {
  const keys = getKeys(props.label);

  return (
    <Container>
      <Arrow />
      <Content style={props.style}>
        {props.label}
        <Keys aria-label={props.label} hidden={keys.length === 0}>
          {keys.map((key, index) => (
            <KeyItem key={index}>{key}</KeyItem>
          ))}
        </Keys>
      </Content>
    </Container>
  );
};

export default memo(Popover);
