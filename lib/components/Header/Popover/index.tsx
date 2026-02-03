import { memo, useEffect, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { schema, watchKeys } from 'app/keymaps/schema';
import useStore from 'lib/store';

import { Arrow, Container, Content, KeyItem, Keys } from './styles';

const Popover: React.FC<PopoverProps> = ({ label, style }) => {
  const { context } = useStore();

  const [keys, setKeys] = useState<string[]>([]);

  const { t } = useTranslation();

  useEffect(() => {
    const command = Object.keys(schema).find(key => schema[key] === label);

    if (command) watchKeys(command, setKeys);
  }, []);

  return (
    <Container>
      <Arrow />
      <Content
        $label={label}
        $keys={keys}
        style={style}
        className={Object.keys(context).length > 0 ? 'auto' : undefined}
      >
        {t(label)}
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
