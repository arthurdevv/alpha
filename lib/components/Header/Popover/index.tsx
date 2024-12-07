import { h } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';

import { schema, watchKeys } from 'app/keymaps/schema';
import useStore from 'lib/store';

import { Arrow, Container, Content, KeyItem, Keys } from './styles';

const Popover: React.FC<PopoverProps> = ({ label, style }) => {
  const { context } = useStore();

  const [keys, setKeys] = useState<string[]>([]);

  const handleCapitalize = (text: string) =>
    text.replace(/(^\w{1})|(\s+\w{1})/g, value => value.toUpperCase());

  useEffect(() => {
    const command = Object.keys(schema).find(key => schema[key] === label);

    if (command) watchKeys(command, setKeys);
  }, []);

  return (
    <Container>
      <Arrow />
      <Content
        $label={label}
        style={style}
        className={Object.keys(context).length > 0 ? 'auto' : undefined}
      >
        {handleCapitalize(label)}
        <Keys $hidden={keys.length === 0}>
          {keys.map((key, index) => (
            <KeyItem key={index}>{key}</KeyItem>
          ))}
        </Keys>
      </Content>
    </Container>
  );
};

export default memo(Popover);
