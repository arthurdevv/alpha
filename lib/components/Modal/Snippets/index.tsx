import { Fragment, memo, useEffect, useRef, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import { getInstanceProfile } from 'app/common/profiles';
import storage from 'app/utils/local-storage';
import {
  useKeyboardNavigation,
  useSearch,
} from 'lib/hooks/useSearchController';
import { getDateFormatted } from 'lib/utils';

import { TrashIcon } from 'components/Icons';
import {
  BadgeItem,
  Badges,
  Container,
  Content,
  Ghost,
  Search,
  SearchInput,
  Suggestion,
  Tag,
  Tags,
  Warning,
} from '../styles';
import {
  Action,
  Badge,
  Button,
  Command,
  Delete,
  Dot,
  Info,
  Input,
  Item,
  List,
  Meta,
  Snippet,
  Title,
  Wrapper,
} from './styles';
import { KeyItem } from 'components/Header/Popover/styles';

function createSnippet(index: number = 0): ISnippet {
  return {
    id: uuidv4(),
    name: `Snippet ${index + 1}`,
    commands: [''],
    lastRun: null,
    lastProfile: null,
  };
}

const Snippets: React.FC<ModalProps> = (props: ModalProps) => {
  const { store, modal, isVisible, handleModal } = props;

  const [snippets, setSnippets] = useState<ISnippet[]>(() => {
    const stored = storage.parseItem('snippets');

    return Array.isArray(stored) ? stored : [];
  });

  const [snippet, setSnippet] = useState<ISnippet | null>(null);

  const snippetRef = useRef<ISnippet | null>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const {
    ref,
    search,
    suggestion,
    handleSearch,
    handleComplete,
    saveSuggestion,
  } = useSearch(modal, props, 'flex');

  const { t } = useTranslation();

  const handleCommands = ({ currentTarget }, index?: number) => {
    const { value } = currentTarget;

    setSnippet(snippet => {
      if (!snippet) return null;

      const updated = { ...snippet };

      if (typeof index === 'number') {
        updated['commands'][index] = value;
      } else {
        updated['commands'].push('');
      }

      return updated;
    });
  };

  const handleBlur = ({ currentTarget }, key: keyof ISnippet) => {
    const { value } = currentTarget;

    if (value) {
      setSnippet(snippet => {
        if (snippet) snippet[key] = value;

        return snippet;
      });
    }

    if (!snippetRef.current) return;

    currentTarget.value = snippetRef.current[key];
  };

  const handleSave = (s?: ISnippet) => {
    const target = s ?? snippet;
    if (!target) return;

    setSnippets(snippets => {
      const index = snippets.findIndex(s => s.id === target.id);

      if (index !== -1) {
        snippets[index] = target;
      } else {
        snippets.unshift(target);
      }

      storage.updateItem('snippets', snippets);

      return snippets;
    });

    setIsEditing(false);
  };

  useEffect(() => {}, [snippets]);

  const handleRun = (index: number) => {
    if (isEditing || !snippets.length || index === -1) return;

    const snippet = snippets[index];
    const profile = getInstanceProfile(store);

    snippet.lastRun = new Date().toISOString();
    snippet.lastProfile = profile ? profile.name : 'Terminal';

    handleSave(snippet);

    snippet.commands.forEach((command, index, array) => {
      store.onData(`${command}\r`);

      if (index === array.length - 1) {
        handleModal();
        saveSuggestion();
      }
    });
  };

  const handleDelete = (_: any, commandIndex?: number) => {
    if (!snippet) return;

    if (typeof commandIndex === 'number') {
      return setSnippet(snippet => {
        if (snippet) snippet.commands.splice(commandIndex, 1);

        return snippet ? { ...snippet } : snippet;
      });
    }

    global.setSnippets = setSnippets;
    global.setIsEditing = setIsEditing;

    global.dialog = {
      source: 'Snippets',
      target: snippet.name,
      data: [snippets, snippet.id],
      snippets: true,
    };

    props.handleModal(undefined, 'Dialog');
  };

  const handleAction = (
    action: 'new' | 'edit' | 'save' | 'cancel',
    s: ISnippet | null = null,
  ) => {
    if (action === 'new' || action === 'edit') {
      const snippet = s ?? createSnippet(snippets.length);
      snippetRef.current = snippet;

      setSnippet(snippet);
      setIsEditing(true);
      return;
    }

    if (action === 'save') handleSave();

    setSnippet(null);
    setIsEditing(false);

    snippetRef.current = null;
  };

  const [selectedIndex, setSelectedIndex] = useKeyboardNavigation(
    snippets.length,
    handleRun,
  );

  const { fontFamily } = store.options;

  return (
    <Container $isVisible={isVisible} $width={23}>
      <Tags>
        <Tag
          $isTitle
          title={snippet?.name}
        >{`${t('Snippets')}${snippet ? `: ${snippet.name}` : ``}`}</Tag>
        {isEditing && snippet ? (
          <>
            <Tag onClick={() => handleAction('save', snippet)}>{t('Save')}</Tag>
            <Tag onClick={() => handleAction('cancel')}>{t('Cancel')}</Tag>
            {snippets.find(s => s.id === snippet.id) && (
              <Tag onClick={handleDelete}>{t('Delete')}</Tag>
            )}
          </>
        ) : (
          <Tag onClick={() => handleAction('new')}>{t('New snippet')}</Tag>
        )}
      </Tags>
      <Content
        style={{
          padding: snippets.length || isEditing ? '0 1rem 1rem' : '1rem',
        }}
      >
        {isEditing && snippet ? (
          <Search style={{ padding: 0, marginBottom: '.5rem' }}>
            <SearchInput
              value={snippet.name}
              placeholder={snippet.name}
              onFocusOut={e => handleBlur(e, 'name')}
            />
          </Search>
        ) : (
          snippets.length > 0 && (
            <Search style={{ padding: 0, marginBottom: '.5rem' }}>
              <SearchInput
                ref={ref}
                value={search}
                placeholder={t('Select or type a snippet')}
                onChange={handleSearch}
                onKeyDown={handleComplete}
                style={{ paddingRight: '2.75rem' }}
              />

              <Suggestion $suggestion={suggestion}>
                <Ghost>{suggestion}</Ghost>
                <BadgeItem>tab</BadgeItem>
              </Suggestion>
            </Search>
          )
        )}
        <Wrapper className="w" style={{ padding: 0, alignItems: 'unset' }}>
          {isEditing && snippet ? (
            <List role="list" style={{ gap: 0 }}>
              {snippet.commands.map((command, index) => (
                <Fragment key={index}>
                  <Command>
                    <Input
                      value={command}
                      style={{ fontFamily }}
                      onChange={e => handleCommands(e, index)}
                    />
                    <Delete onClick={() => handleDelete(undefined, index)}>
                      <TrashIcon />
                    </Delete>
                  </Command>
                </Fragment>
              ))}
              <Button
                onClick={e => handleCommands(e)}
                $length={snippet.commands.length}
              >
                {t('Add command')}
              </Button>
            </List>
          ) : snippets.length ? (
            <List role="list">
              {snippets.map((snippet, index) => {
                const { id, name, commands, lastRun, lastProfile } = snippet;

                const date = lastRun
                  ? getDateFormatted('en-US', lastRun)
                  : null;

                const cmdTrimmed = commands.filter(c => c.trim());
                const cmdText = cmdTrimmed.join('\n');

                const cmdPreview =
                  cmdTrimmed.length > 1 ? cmdTrimmed[0] : cmdText;

                return (
                  <Item
                    key={id}
                    data-name={name}
                    $selected={selectedIndex === index}
                    onClick={() => handleAction('edit', snippet)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <Dot />
                    <Snippet>
                      <Title>{name}</Title>
                      {/* <div className={'edit'}>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM2 7.5C2 7.22386 2.22386 7 2.5 7H7.5C7.77614 7 8 7.22386 8 7.5C8 7.77614 7.77614 8 7.5 8H2.5C2.22386 8 2 7.77614 2 7.5ZM2 10.5C2 10.2239 2.22386 10 2.5 10H10.5C10.7761 10 11 10.2239 11 10.5C11 10.7761 10.7761 11 10.5 11H2.5C2.22386 11 2 10.7761 2 10.5Z"
                            fill="currentColor"
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </div> */}
                      <Info>
                        {cmdPreview ? (
                          <Badges style={{ marginLeft: 0 }}>
                            <Badge style={{ fontFamily }} title={cmdText}>
                              {cmdPreview}
                            </Badge>
                            {cmdTrimmed.length > 1 && (
                              <Badge style={{ fontFamily }}>
                                + {commands.length - 1}
                              </Badge>
                            )}
                          </Badges>
                        ) : (
                          <Meta $empty>{t('No commands yet')}</Meta>
                        )}
                        <Meta>
                          {date
                            ? `${t('Last ran')} ${date} ${t('in')} ${lastProfile}`
                            : t('Not run yet')}
                        </Meta>
                      </Info>
                    </Snippet>
                    <Action>
                      <BadgeItem style={{ gap: '.25rem' }}>ENTER ↵</BadgeItem>
                    </Action>
                  </Item>
                );
              })}
              <Warning style={{ display: 'none' }}>
                {t('No results found')}
              </Warning>
            </List>
          ) : (
            <Warning>{t('No snippets yet')}</Warning>
          )}
        </Wrapper>
      </Content>
    </Container>
  );
};

export default memo(Snippets);
