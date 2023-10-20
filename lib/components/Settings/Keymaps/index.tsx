import { h } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';

import { getKeymaps, writeKeymaps } from 'app/keymaps';
import mapping, { parseKeys } from './schema';

import {
  Container,
  List,
  ListItem,
  Separator,
  Label,
  Keys,
  KeyItem,
  Title,
  Preview,
  PreviewKeys,
  PreviewKeyItem,
} from './styles';

const Keymaps: React.FC = () => {
  const [command, setCommand] = useState<string | undefined>();

  const [inputKeys, setInputKeys] = useState<string[]>([]);

  const resetState = () => {
    setInputKeys([]);
    setCommand(undefined);

    return [];
  };

  const handleCommand = ({ currentTarget }) => {
    const command = currentTarget.getAttribute('data-command');

    setCommand(command);
  };

  const handleKeys = (event: KeyboardEvent) => {
    event.preventDefault();

    let { key, ctrlKey } = event;

    if (key === 'Escape') {
      return resetState();
    }

    key = ctrlKey ? 'Ctrl' : key;

    setInputKeys(prev => {
      if (event.key === 'Enter') {
        if (prev.length >= 1 && command) {
          const keymaps = getKeymaps();

          keymaps[command] = [prev.join('+').toLowerCase()];

          writeKeymaps(keymaps);
        }

        return resetState();
      }

      const keys = new Set([...prev, key]);

      return prev.length < 3 ? Array.from(keys) : prev;
    });
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeys);

    return () => {
      document.removeEventListener('keydown', handleKeys);
    };
  }, [command]);

  return (
    <Container>
      <List>
        {Object.keys(mapping).map((command, index) => {
          const label = mapping[command];

          const keys = parseKeys(command);

          return (
            <ListItem key={index}>
              <Separator />
              <Label>{label}</Label>
              <Keys data-command={command} onClick={handleCommand}>
                {keys.map((value, index) => (
                  <KeyItem key={index}>{value}</KeyItem>
                ))}
              </Keys>
            </ListItem>
          );
        })}
      </List>
      {command && (
        <Preview>
          <Title>Press key combination and then press ENTER</Title>
          <PreviewKeys>
            {inputKeys.map((value, index) => (
              <PreviewKeyItem key={index}>{value}</PreviewKeyItem>
            ))}
          </PreviewKeys>
        </Preview>
      )}
    </Container>
  );
};

export default memo(Keymaps);
