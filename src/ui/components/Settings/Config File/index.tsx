import { cx } from '@linaria/core';
import { useEffect, useReducer } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { executeCommand } from 'ui/commands/registry';

import { Action, Title } from 'components/Settings/styles';
import { Key, Keys } from 'components/Tooltip/styles';

import {
  Content,
  Hint,
  HintLabel,
  Selector,
  Selectors,
  Textarea,
  Warning,
  Wrapper,
} from './styles';

interface ConfigFileState {
  content: string;
  mode: string;
  isDirty: boolean;
}

export default function ConfigFile() {
  const [state, dispatch] = useReducer(
    (prev: ConfigFileState, next: Partial<ConfigFileState>) => ({ ...prev, ...next }),
    undefined,
    () => ({ content: '', mode: 'edit', isDirty: false }),
  );

  const { t } = useTranslation();

  const handleInput = ({ currentTarget }) => {
    const { value } = currentTarget;
    dispatch({ isDirty: value !== state.content });
    dispatch({ content: value });
  };

  const handleSave = (event: KeyboardEvent) => {
    if (!state.isDirty || state.mode === 'defaults') return;

    if (event.ctrlKey && event.code === 'KeyS') {
      event.preventDefault();

      ipc.settings.save(JSON.parse(state.content));
      dispatch({ isDirty: false });
    }
  };

  useEffect(() => {
    ipc.settings.load(state.mode === 'defaults').then(settings => {
      const content = JSON.stringify(settings, null, 2);
      if (content !== state.content) dispatch({ content });
    });
  }, [state.mode]);

  return (
    <>
      <Title style={{ display: 'flex', alignItems: 'center', gap: '.125rem' }}>
        {t('Config file')}
        <Warning className={cx(state.isDirty && 'visible')} />
        <Selectors>
          <Selector
            className={cx(state.mode === 'edit' && 'selected')}
            onClick={() => dispatch({ mode: 'edit' })}
          >
            {t('Edit')}
          </Selector>
          <Selector
            className={cx(state.mode === 'defaults' && 'selected')}
            onClick={() => dispatch({ mode: 'defaults' })}
          >
            {t('Defaults')}
          </Selector>
        </Selectors>
      </Title>
      <Content>
        <Textarea
          key={state.mode}
          value={state.content}
          readOnly={state.mode === 'defaults'}
          className={cx(state.mode === 'defaults' && 'defaults')}
          onInput={handleInput}
          onKeyDown={handleSave}
        />
      </Content>
      <Wrapper>
        <Hint className="media-34">
          <HintLabel>{t('Use')}</HintLabel>
          <Keys style={{ marginLeft: 0 }}>
            <Key>Ctrl</Key>
            <Key>S</Key>
          </Keys>
          <HintLabel>{t('to save changes')}</HintLabel>
        </Hint>
        <Wrapper>
          <Action onClick={() => executeCommand('app:modal', 'Sync')}>
            {t('Import from Gist')}
          </Action>
        </Wrapper>
      </Wrapper>
    </>
  );
}
