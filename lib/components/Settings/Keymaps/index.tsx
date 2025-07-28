import { Fragment, h } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';

import { getKeymaps, mousetrap, writeKeymaps } from 'app/keymaps';
import { parseKeys, schema } from 'app/keymaps/schema';

import { Overlay } from 'lib/components/Modal/styles';
import { KeyItem as KeyBadge } from 'lib/components/Header/Popover/styles';
import { Title } from '../styles';
import {
  Action,
  Editor,
  EditorContent,
  EditorKey,
  EditorKeys,
  EditorTag,
  EditorTags,
  EditorTitle,
  Item,
  Key,
  Keys,
  Label,
  List,
  Separator,
  Wrapper,
} from './styles';

let combination: string[] = [];

const Keymaps: React.FC = () => {
  const [command, setCommand] = useState({ value: '', index: -1 });

  const [pressedKeys, setPressedKeys] = useState<string[]>([]);

  const [shouldReset, setShouldReset] = useState<boolean>(false);

  const getEventKey = ({ key }: KeyboardEvent) => {
    if (key.includes('Arrow')) {
      key = key.replace('Arrow', '');
    } else if (key === 'Control') {
      key = 'Ctrl';
    }

    return key.toLowerCase();
  };

  const getCommandKeymap = () => {
    const keymaps = getKeymaps();

    return { keymaps, keys: keymaps[command.value] };
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();

    const key = getEventKey(event);

    if (key === 'escape') {
      return resetState();
    }

    if (key === 'enter') {
      if (pressedKeys.length === 0) {
        return resetState();
      }

      if (pressedKeys.length > 0 && combination.length <= 1) {
        return setShouldReset(true);
      }
    }

    setPressedKeys(keys => {
      combination.push(key);

      if (!keys.includes(key)) {
        keys.push(key);
      }

      return [...keys];
    });
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const key = getEventKey(event);

    combination = combination.filter(value => value !== key);
  };

  const handleDelete = () => {
    const { keymaps, keys } = getCommandKeymap();

    if (command.index !== -1) {
      keys.splice(command.index, 1);

      writeKeymaps(keymaps);
    }

    resetState();
  };

  const handleOverlay = (event: React.TargetedEvent<HTMLElement>) => {
    const { target, currentTarget } = event;

    target === currentTarget && resetState();
  };

  const resetState = () => {
    setCommand({ value: '', index: -1 });
    setPressedKeys([]);
    setShouldReset(false);
  };

  useEffect(() => {
    if (pressedKeys.length > 0) {
      const { keymaps, keys } = getCommandKeymap();

      const joinedKeys = pressedKeys.join('+');

      if (command.index === -1) {
        keys.push(joinedKeys);
      } else if (!keys.includes(joinedKeys)) {
        keys[command.index] = joinedKeys;
      }

      writeKeymaps(keymaps);
    }

    resetState();
  }, [shouldReset]);

  useEffect(() => {
    if (command.value) {
      mousetrap.stopCallback = () => true;

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      mousetrap.stopCallback = () => false;

      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
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
            <Item key={index}>
              <Separator />
              <Label>{label}</Label>
              <Wrapper>
                <Action
                  onClick={() => setCommand({ value: command, index: -1 })}
                >
                  Add keys...
                </Action>
                {keys.map((keys, index) => (
                  <Keys key={index}>
                    <Key onClick={() => setCommand({ value: command, index })}>
                      {keys.map((key, index) => (
                        <span key={index}>{key}</span>
                      ))}
                    </Key>
                  </Keys>
                ))}
              </Wrapper>
            </Item>
          );
        })}
      </List>
      <Overlay $isVisible={Boolean(command.value)} onClick={handleOverlay}>
        <Editor $isVisible={Boolean(command.value)}>
          <EditorTags>
            {command.index !== -1 && (
              <EditorTag onClick={handleDelete}>Delete</EditorTag>
            )}
          </EditorTags>
          <EditorContent>
            <EditorTitle>
              Press key combination and then press <KeyBadge>ENTER</KeyBadge>
            </EditorTitle>
            <EditorKeys>
              {pressedKeys.map((value, index) => (
                <EditorKey key={index}>{value}</EditorKey>
              ))}
            </EditorKeys>
          </EditorContent>
        </Editor>
      </Overlay>
    </Fragment>
  );
};

export default memo(Keymaps);
