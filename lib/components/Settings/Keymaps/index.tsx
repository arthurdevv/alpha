import { Fragment } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';

import { getKeymaps, mousetrap, writeKeymaps } from 'app/keymaps';
import { parseKeys, schema, watchKeys } from 'app/keymaps/schema';

import { Overlay } from 'lib/components/Modal/styles';
import { KeyItem as KeyBadge } from 'lib/components/Header/Popover/styles';
import {
  Wrapper as Warning,
  Label as WarningLabel,
} from 'lib/components/Settings/Config/styles';
import {
  KeyItem as WarningKey,
  Keys as WarningKeys,
} from 'lib/components/Terminal/Watermark/styles';
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

const Keymaps: React.FC<SectionProps> = ({ t }) => {
  const [command, setCommand] = useState({ label: '', value: '', index: -1 });

  const [pressedKeys, setPressedKeys] = useState<string[]>([]);

  const [shouldReset, setShouldReset] = useState<boolean>(false);

  const [paneKeys, setPaneKeys] = useState<string[]>([]);

  const getEventKey = ({ key }: KeyboardEvent) => {
    if (key.includes('Arrow')) {
      key = key.replace('Arrow', '');
    } else if (key === 'Control') {
      key = 'Ctrl';
    } else if (key === ' ') {
      key = 'Space';
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
    setCommand({ label: '', value: '', index: -1 });
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

  useEffect(() => watchKeys('app:keymaps', setPaneKeys, false), []);

  return (
    <Fragment>
      <Title style={{ marginTop: 0 }}>
        {t('Keymaps')}
        <Warning $element="Keymaps" style={{ marginLeft: 'auto' }}>
          <WarningLabel>{t('Use')}</WarningLabel>
          <WarningKeys>
            {paneKeys.map((key, index) => (
              <WarningKey key={index}>{key}</WarningKey>
            ))}
          </WarningKeys>
          <WarningLabel>
            {t('to view all keymaps in the side panel')}
          </WarningLabel>
        </Warning>
      </Title>
      <List>
        {Object.keys(schema).map((command, index) => {
          const label = schema[command];

          let keys = parseKeys(command);

          let readonly = false;

          if (command.includes('by-number')) {
            const [scope] = command.split(':');

            keys = [[scope === 'tab' ? 'ctrl' : 'alt', '1 — 9']];
            readonly = true;
          }

          return (
            <Item key={index}>
              <Separator />
              <Label>{t(label)}</Label>
              <Wrapper>
                <Action
                  style={{ display: readonly ? 'none' : undefined }}
                  onClick={() =>
                    setCommand({ label, value: command, index: -1 })
                  }
                >
                  {t('Add keys...')}
                </Action>
                {keys.map((keys, index) => (
                  <Keys
                    key={index}
                    style={{ cursor: readonly ? 'default' : undefined }}
                    onClick={() =>
                      !readonly && setCommand({ label, value: command, index })
                    }
                  >
                    <Key>
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
            <EditorTag $isText>{`${t('Keymaps')}: ${command.label}`}</EditorTag>
            <EditorTag
              $isText
              style={{
                marginRight: 'unset',
                color: 'rgba(128, 128, 128, 1.0)',
              }}
            >
              {`${t('Use')} `}
              <KeyBadge $isHint>ESC</KeyBadge>
              {` ${t('to cancel')}`}
            </EditorTag>
            {command.index !== -1 && (
              <Fragment>
                <EditorTag onClick={handleDelete}>{t('Delete')}</EditorTag>
              </Fragment>
            )}
          </EditorTags>
          <EditorContent>
            <EditorTitle>
              {t('Press key combination and then press')}{' '}
              <KeyBadge>ENTER</KeyBadge>
            </EditorTitle>
            <EditorKeys>
              {!pressedKeys.length && (
                <div>{t('Listening for key combination…')}</div>
              )}
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
