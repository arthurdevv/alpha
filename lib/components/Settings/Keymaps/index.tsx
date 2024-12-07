import { Fragment, h } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';

import { getKeymaps, writeKeymaps } from 'app/keymaps';
import { parseKeys, schema } from 'app/keymaps/schema';

import { Overlay } from 'lib/components/Modal/styles';
import { KeyItem as KeyBadge } from 'lib/components/Header/Popover/styles';
import { Title } from '../styles';
import {
  Key,
  Keys,
  Label,
  List,
  ListItem,
  Preview,
  PreviewKey,
  PreviewKeys,
  PreviewTitle,
  Separator,
} from './styles';

const Keymaps: React.FC = () => {
  const [command, setCommand] = useState<string | undefined>();

  const [inputKeys, setInputKeys] = useState<string[]>([]);

  const handleKeys = (event: KeyboardEvent) => {
    event.preventDefault();

    let { key, ctrlKey } = event;

    if (key === 'Escape') {
      return resetState();
    }

    key = ctrlKey ? 'Ctrl' : key;

    setInputKeys(keys => {
      if (key === 'Enter') {
        if (keys.length >= 1 && command) {
          const keymaps = getKeymaps();

          keymaps[command] = [keys.join('+').toLowerCase()];

          writeKeymaps(keymaps);
        }

        return resetState();
      }

      const updatedKeys = new Set([...keys, key]);

      return keys.length < 5 ? Array.from(updatedKeys) : keys;
    });
  };

  const handleCommand = ({ currentTarget }) => {
    const command = currentTarget.getAttribute('data-command');

    setCommand(command);
  };

  const resetState = () => {
    setInputKeys([]);
    setCommand(undefined);

    return [];
  };

  const handleOverlay = (event: React.TargetedEvent<HTMLElement>) => {
    const { target, currentTarget } = event;

    target === currentTarget && resetState();
  };

  useEffect(() => {
    if (command) {
      document.addEventListener('keydown', handleKeys);
    }

    return () => {
      document.removeEventListener('keydown', handleKeys);
    };
  }, [command]);

  return (
    <Fragment>
      <Title style={{ marginTop: 0 }}>Keymaps</Title>
      <List>
        {Object.keys(schema).map((command, index) => {
          const label = schema[command];

          const keys = parseKeys(command);

          return (
            <ListItem key={index}>
              <Separator />
              <Label>{label}</Label>
              <Keys>
                <Key data-command={command} onClick={handleCommand}>
                  {keys.map((value, index) => (
                    <span key={index}>{value}</span>
                  ))}
                </Key>
              </Keys>
            </ListItem>
          );
        })}
      </List>
      <Overlay $isVisible={Boolean(command)} onClick={handleOverlay}>
        <Preview>
          <PreviewTitle>
            Press key combination and then press <KeyBadge>ENTER</KeyBadge>
          </PreviewTitle>
          <PreviewKeys>
            {inputKeys.map((value, index) => (
              <PreviewKey key={index}>{value}</PreviewKey>
            ))}
          </PreviewKeys>
        </Preview>
      </Overlay>
    </Fragment>
  );
};

export default memo(Keymaps);
