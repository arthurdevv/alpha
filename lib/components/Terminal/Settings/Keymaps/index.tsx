import { h, Fragment } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';

import { getKeymaps, writeKeymaps } from 'app/keymaps';
import { schema, parseKeys } from 'app/keymaps/schema';

import {
  List,
  ListItem,
  Separator,
  Label,
  Reset,
  Keys,
  KeyItem,
  Preview,
  PreviewKeys,
  PreviewTitle,
  PreviewKeyItem,
} from './styles';
import { Title } from '../styles';
import { Overlay } from 'lib/components/Modal/styles';
import { KeyItem as KeyBadge } from 'lib/components/Header/Popover/styles';
import { ResetIcon } from 'lib/components/Icons';

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
      if (key === 'Enter') {
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
    <Fragment>
      <Title style={{ marginTop: 0 }}>Keymaps</Title>
      <List>
        {Object.keys(schema).map((command, index) => {
          const label = schema[command];

          const { keys, changed, handleReset } = parseKeys(command);

          return (
            <ListItem key={index}>
              <Separator />
              <Label>{label}</Label>

              <Keys>
                <KeyItem data-command={command} onClick={handleCommand}>
                  {keys.map((value, index) => (
                    <span key={index}>{value}</span>
                  ))}
                </KeyItem>
                {changed && (
                  <Reset onClick={() => handleReset(resetState)}>
                    <ResetIcon />
                  </Reset>
                )}
              </Keys>
            </ListItem>
          );
        })}
      </List>
      {command && (
        <Overlay $isVisible={true}>
          <Preview>
            <PreviewTitle>
              Press key combination and then press <KeyBadge>ENTER</KeyBadge>
            </PreviewTitle>
            <PreviewKeys>
              {inputKeys.map((value, index) => (
                <PreviewKeyItem key={index}>{value}</PreviewKeyItem>
              ))}
            </PreviewKeys>
          </Preview>
        </Overlay>
      )}
    </Fragment>
  );
};

export default memo(Keymaps);
