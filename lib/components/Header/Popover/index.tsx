import { h } from 'preact';
import { memo } from 'preact/compat';

import { Container, Content, Keys, KeyItem, Arrow } from './styles';

const Popover: React.FC<PopoverProps> = (props: PopoverProps) => {
  const keys = ((props: PopoverProps): string[] => {
    switch (props.label) {
      case 'New Terminal':
        return global.isMac ? ['⌘', 't'] : ['Ctrl', '⇧', 't'];

      case 'Settings':
        return global.isMac ? ['⌘', ','] : ['Ctrl', ','];

      case 'Minimize':
        return global.isMac ? ['⌘', 'm'] : ['Ctrl', '⇧', 'm'];

      case 'Close':
        return global.isMac ? ['⌘', '⇧', 'w'] : ['Alt', 'f4'];

      case 'Close Terminal':
        return global.isMac ? ['⌘', 'w'] : ['Ctrl', '⇧', 'w'];
    }

    return [];
  })(props);

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
