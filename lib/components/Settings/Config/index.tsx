import { Fragment, h } from 'preact';
import { memo, useCallback, useEffect, useState } from 'preact/compat';

import { getSettings, loadSettings, writeSettings } from 'app/settings';
import fetchSettings from 'app/api/fetch-config';

import {
  Container,
  Content,
  Overlay,
  Search,
  SearchInput,
  Tag,
  Tags,
} from 'lib/components/Modal/styles';
import { KeyItem, Keys } from 'lib/components/Terminal/Watermark/styles';
import { Action, Code, Label, Warning, Wrapper } from './styles';
import { Title } from '../styles';

const Config: React.FC = () => {
  const [content, setContent] = useState<string>('');

  const [gist, setGist] = useState<string | null>(null);

  const [isImporting, setIsImporting] = useState<boolean>(false);

  const [isContentChanged, setIsContentChanged] = useState<boolean>(false);

  const handleInput = ({ currentTarget }) => {
    setGist(currentTarget.value);
  };

  const handleOverlay = ({ target, currentTarget }) => {
    if (target === currentTarget) setIsImporting(false);
  };

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
      if (!isContentChanged) return;

      if (event.ctrlKey && (event.key === 's' || event.key === 'S')) {
        event.preventDefault();

        writeSettings(content, () => setIsContentChanged(false));
      }
    },
    [content, isContentChanged],
  );

  const handleImport = useCallback(async () => {
    const fetchedContent = await fetchSettings(gist);

    if (fetchedContent) {
      setContent(fetchedContent);

      setIsContentChanged(true);
    }

    setIsImporting(false);
  }, [gist]);

  useEffect(() => {
    const loadedContent = loadSettings(false, true);

    if (typeof loadedContent === 'string') setContent(loadedContent);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleSave);

    return () => {
      document.removeEventListener('keydown', handleSave);
    };
  }, [handleSave]);

  useEffect(() => setGist(null), [isImporting]);

  const { fontFamily } = getSettings();

  return (
    <Fragment>
      <Title style={{ marginTop: 0, display: 'flex', alignItems: 'center' }}>
        Config <Warning $visible={isContentChanged} />
      </Title>
      <Code
        $fontFamily={fontFamily}
        spellcheck={false}
        onChange={handleContent}
      >
        {content}
      </Code>
      <Wrapper>
        <Wrapper>
          <Label>Use</Label>
          <Keys>
            <KeyItem>Ctrl</KeyItem>
            <KeyItem>S</KeyItem>
          </Keys>
          <Label>to save changes</Label>
        </Wrapper>
        <Wrapper>
          <Action onClick={() => setIsImporting(true)}>Import from Gist</Action>
        </Wrapper>
      </Wrapper>
      <Overlay $isVisible={isImporting} onClick={handleOverlay}>
        <Container $isVisible={isImporting}>
          <Tags>
            <Tag $isTitle>Config</Tag>
            <Tag onClick={handleImport}>Import</Tag>
            <Tag onClick={() => setIsImporting(false)}>Cancel</Tag>
          </Tags>
          <Content>
            <Search>
              <SearchInput
                placeholder="Paste a valid Gist ID"
                onChange={handleInput}
                value={gist || ''}
              />
            </Search>
          </Content>
        </Container>
      </Overlay>
    </Fragment>
  );
};

export default memo(Config);
