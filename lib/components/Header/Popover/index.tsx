import { h } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';

import useStore from 'lib/store';
import handleKeys from './keys';

import { Container, Content, Keys, KeyItem, Arrow } from './styles';

const Popover: React.FC<PopoverProps> = ({ label, style }) => {
  const [keys, setKeys] = useState<string[]>([]);

  const { context } = useStore();

  useEffect(() => handleKeys(label, setKeys), []);

  return (
    <Container>
      <Arrow />
      <Content
        $label={label}
        style={style}
        className={Object.keys(context).length >= 1 && 'auto'}
      >
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
