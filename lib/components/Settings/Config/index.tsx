import { Fragment } from 'preact';
import { memo, useCallback, useEffect, useState } from 'preact/compat';

import { execCommand } from 'app/keymaps/commands';
import { getSettings, loadSettings, writeSettings } from 'app/settings';

import { KeyItem, Keys } from 'lib/components/Terminal/Watermark/styles';
import listeners from 'app/settings/listeners';
import {
  Action,
  Code,
  Label,
  Selector,
  Selectors,
  Warning,
  Wrapper,
} from './styles';
import { Title } from '../styles';

const Config: React.FC<SectionProps> = ({ t }) => {
  const [content, setContent] = useState<string>('');

  const [selector, setSelector] = useState<'edit' | 'defaults'>('edit');

  const [isContentChanged, setIsContentChanged] = useState<boolean>(false);

  const [transition, setTransition] = useState<boolean>(true);

  const handleContent = useCallback(
    ({ currentTarget }) => {
      const { value } = currentTarget;

      setIsContentChanged(value !== content);
      setContent(value);
    },
    [content],
  );

  const handleSave = useCallback(
    (event: KeyboardEvent) => {
      if (!isContentChanged || selector === 'defaults') return;

      if (event.ctrlKey && event.key.toLowerCase() === 's') {
        event.preventDefault();

        writeSettings(content, () => setIsContentChanged(false));
      }
    },
    [content, isContentChanged],
  );

  const handleSelector = (value: 'edit' | 'defaults') => {
    if (value !== selector) {
      setTransition(false);

      setTimeout(() => {
        setTransition(true);

        setSelector(value);
      }, 125);
    }
  };

  const getContent = () => {
    const loadedContent = loadSettings(selector !== 'edit', true);

    if (typeof loadedContent === 'string' && loadedContent !== content) {
      setContent(`${loadedContent}`);
    }

    if (selector === 'defaults') setIsContentChanged(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleSave);

    return () => {
      window.removeEventListener('keydown', handleSave);
    };
  }, [handleSave]);

  useEffect(() => getContent(), [selector]);

  useEffect(() => {
    const { unsubscribe } = listeners.subscribe('options', () => getContent());

    return () => {
      unsubscribe();
    };
  }, []);

  const { fontFamily } = getSettings();

  return (
    <Fragment>
      <Title
        style={{
          marginTop: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '.125rem',
        }}
      >
        {t('Config file')} <Warning $visible={isContentChanged} />
        <Selectors>
          <Selector
            className={selector === 'edit' ? 'selected' : undefined}
            onClick={() => handleSelector('edit')}
          >
            {t('Edit')}
          </Selector>
          <Selector
            className={selector === 'defaults' ? 'selected' : undefined}
            onClick={() => handleSelector('defaults')}
          >
            {t('Defaults')}
          </Selector>
        </Selectors>
      </Title>
      <Code
        $fontFamily={fontFamily}
        $transition={transition}
        $defaults={selector === 'defaults'}
        readOnly={selector === 'defaults'}
        value={content}
        spellcheck={false}
        onChange={handleContent}
      />
      <Wrapper>
        <Wrapper $element="Config">
          <Label>{t('Use')}</Label>
          <Keys>
            <KeyItem>Ctrl</KeyItem>
            <KeyItem>S</KeyItem>
          </Keys>
          <Label>{t('to save changes')}</Label>
        </Wrapper>
        <Wrapper>
          <Action
            onClick={() => {
              handleSelector('edit');
              execCommand('app:modal', 'Sync');
            }}
          >
            {t('Import from Gist')}
          </Action>
        </Wrapper>
      </Wrapper>
    </Fragment>
  );
};

export default memo(Config);
