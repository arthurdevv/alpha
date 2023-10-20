import { h } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';

import handleKeys from './keys';

import { Container, Content, Keys, KeyItem, Arrow } from './styles';

const Popover: React.FC<PopoverProps> = ({ label, style }: PopoverProps) => {
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    handleKeys(label, setKeys);
  }, []);

  return (
    <Container>
      <Arrow />
      <Content style={style}>
        {label}
        <Keys aria-label={label} hidden={keys.length === 0}>
          {keys.map((key, index) => (
            <KeyItem key={index}>{key}</KeyItem>
          ))}
        </Keys>
      </Content>
    </Container>
  );
};

export default memo(Popover);
