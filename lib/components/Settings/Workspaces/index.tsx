import { Fragment } from 'preact';
import { memo, useEffect, useRef, useState } from 'preact/compat';

import { setSettings } from 'app/settings';
import { loadTheme } from 'app/common/themes';
import { execCommand } from 'app/keymaps/commands';
import { useSettings } from 'app/settings/listeners';
import {
  createWorkspace,
  createWorkspaceTab,
  getPreviewPrompt,
} from 'app/common/workspaces';
import { theme as globalTheme } from 'lib/styles/theme';
import { onSearch } from 'lib/utils';

import {
  GearsIcon,
  PlusIcon,
  RunIcon,
  SearchIcon,
  SearchOffIcon,
} from 'components/Icons';
import { Cursor, Flex, Preview } from 'components/Settings/Appearance/styles';
import { Form, FormItem, Placeholder, Title as Section } from '../styles';
import styles from './styles.module.css';
import PromptExample from './example';

const Workspaces: React.FC<SectionProps> = ({ options, store, t }) => {
  const [{ workspaces, theme: _theme, tabWidth, fontFamily, fontWeight }] =
    useSettings();

  const [context, setContext] = useState<WorkspaceContext>(() => {
    const getEntries = (key: 'tabs' | 'commands'): Record<string, any> => {
      const entries = workspaces.map(({ id, tabs: [firstTab] }) => [
        id,
        key === 'tabs' ? 0 : firstTab.commands.join('\n'),
      ]);

      return Object.fromEntries(entries);
    };

    return {
      tabs: getEntries('tabs'),
      commands: getEntries('commands'),
      prompt: undefined,
    };
  });

  const workspacesRef = useRef<IWorkspace[]>(workspaces);

  const handleContext = (
    key: keyof typeof context,
    id: string | undefined,
    value?: string | number,
  ) =>
    setContext(context => {
      if (key === 'prompt') {
        context[key] = id;
      } else if (
        id &&
        (typeof value === 'string' || typeof value === 'number')
      ) {
        context[key][id] = value;
      }

      return { ...context };
    });

  const handleCreate = (id?: string, event?: any) => {
    const _workspaces = [...workspaces];

    if (id) {
      const index = workspaces.findIndex(w => w.id === id);

      const { length } = _workspaces[index].tabs;

      _workspaces[index].tabs.push(createWorkspaceTab(t, length + 1));

      handleContext('tabs', id, length);
      handleContext('commands', id, '');
    } else {
      const workspace = createWorkspace(t, _workspaces.length + 1);

      _workspaces.push(workspace);

      handleContext('tabs', workspace.id, 0);
      handleContext('commands', workspace.id, '');

      // eslint-disable-next-line prefer-destructuring
      id = workspace.id;
    }

    if (event) handleCursor(event, id);

    setSettings('workspaces', _workspaces);
  };

  const handleName = ({ currentTarget }, id: string) => {
    const { value } = currentTarget;

    const index = workspaces.findIndex(w => w.id === id);

    if (value) {
      const _workspaces = [...workspaces];

      _workspaces[index]['name'] = value;

      return setSettings('workspaces', _workspaces);
    }

    currentTarget.value = workspacesRef.current[index]['name'];
  };

  const handleAction = (workspace: IWorkspace, index?: number, event?: any) => {
    const { id, tabs } = workspace;

    if (typeof index === 'number') {
      const { commands } = tabs[index];

      handleContext('tabs', id, index);
      handleContext('commands', id, commands.join('\n'));

      if (event) handleCursor(event, id);
    } else {
      execCommand('app:run-workspace', workspace);
    }
  };

  const handleEdit = (
    event: MouseEvent,
    workspace: IWorkspace,
    index: number,
  ) => {
    event.stopPropagation();

    execCommand('app:modal', 'Workspace', () => {
      global.tabIndex = index;

      store.setWorkspace(workspace);
    });
  };

  const handlePrompt = (id: string, event: any) => {
    const { type, key } = event;

    let prompt = context.commands[id] || '';

    switch (type) {
      case 'keydown': {
        event.preventDefault();

        if (key.length === 1) prompt += key;

        if (key === 'Enter') prompt += '\n';

        if (key === 'Backspace') prompt = prompt.slice(0, -1);

        return handleContext('commands', id, prompt);
      }

      case 'click':
        return handleContext('prompt', id);

      case 'focusout': {
        handleContext('prompt', undefined);

        const _workspaces = [...workspaces];

        const index = workspaces.findIndex(w => w.id === id);
        const tabIndex = context.tabs[id];

        _workspaces[index].tabs[tabIndex].commands = prompt
          .split('\n')
          .filter(c => c !== '');

        return setSettings('workspaces', _workspaces);
      }
    }
  };

  const handleCursor = ({ currentTarget }, id: string) => {
    const root = currentTarget?.closest('[data-role="window"]');
    const code = root?.querySelector('[data-role="code"]');

    if (code) {
      code.click();
      code.focus();
    }

    handleContext('prompt', id);
  };

  const handleFormSearch = ({ currentTarget, type }) => {
    const { parentElement, value } = currentTarget;

    switch (type) {
      case 'click':
        parentElement.style.width = '12rem';
        break;

      case 'focusout':
        if (!value) parentElement.style.width = '5rem';
        break;

      case 'input': {
        const { parentElement } = currentTarget.closest('[role="section"]');

        const event = {
          currentTarget: { value, parentElement: { parentElement } },
        };

        return onSearch(event, 'flex');
      }
    }
  };

  useEffect(() => {
    global.handleContext = handleContext;
    workspacesRef.current = workspaces;

    return () => {
      delete global.dialog;
      delete global.handleContext;
    };
  }, [workspaces]);

  const theme = loadTheme(_theme);

  return (
    <Fragment>
      <Section style={{ marginTop: 0 }} role="section">
        {t('Workspaces')}
        <Form>
          <FormItem style={{ width: '5rem' }}>
            <input
              placeholder={t('Search')}
              onClick={handleFormSearch}
              onBlur={handleFormSearch}
              onChange={handleFormSearch}
            />
            <SearchIcon />
          </FormItem>
          <FormItem onClick={() => handleCreate(undefined)}>
            {t('New workspace')}
          </FormItem>
        </Form>
      </Section>
      {options}
      <div className={`${styles.wrapper} w ${workspaces.length === 0 ? styles.blank : ''}`}>
        {workspaces.length ? (
          <ul className={styles.list} role="list">
            {workspaces
              .map((workspace, index, array) => {
                const { id, name, tabs } = workspace;

                const selected = {
                  tab: context.tabs[id] ?? 0,
                  commands: context.commands[id] ?? '',
                };

                const tab = tabs[selected.tab] ?? tabs[0];

                const [prefix, symbol] = getPreviewPrompt(tab, theme);

                const handlePreview = handlePrompt.bind(null, id);

                const i = array.toReversed().findIndex(w => w.id === id);

                return (
                  <li
                    key={index}
                    className={styles.workspace}
                    data-name={name}
                    style={{ animationDelay: `${i / 5}s` }}
                  >
                    <input
                      className={styles.name}
                      value={name}
                      placeholder={name}
                      onBlur={e => handleName(e, id)}
                    />
                    <div className={styles.window} data-role="window">
                      <header className={styles.header}>
                        <div className={styles.tabs} role="tablist">
                          {tabs.map((tab, index) => {
                            const tabClasses = [
                              styles.tab,
                              index === selected.tab ? styles.tabCurrent : '',
                              tabWidth === 'fixed' ? styles.tabFixed : styles.tabFit,
                            ].filter(Boolean).join(' ');

                            return (
                              <div
                                key={index}
                                className={tabClasses}
                                onClick={e => handleAction(workspace, index, e)}
                              >
                                <div className={styles.mask} />
                                <span className={styles.title} title={tab.title}>{tab.title}</span>
                                <div
                                  className={styles.button}
                                  onClick={e => handleEdit(e, workspace, index)}
                                  style={{ right: '1.875rem' }}
                                >
                                  <GearsIcon />
                                  <div className={styles.label}>
                                    <div className={styles.arrow} />
                                    <span>{t('Edit tab')}</span>
                                  </div>
                                </div>
                                <div
                                  className={styles.button}
                                  onClick={() =>
                                    handleAction({ tabs: [tab] } as IWorkspace)
                                  }
                                >
                                  <RunIcon w={'1rem'} />
                                  <div className={styles.label}>
                                    <div className={styles.arrow} />
                                    <span>{t('Run tab')}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className={styles.action} onClick={() => handleCreate(id)}>
                          <PlusIcon />
                          <div className={styles.label}>
                            <div className={styles.arrow} />
                            <span>{t('New tab')}</span>
                          </div>
                        </div>
                        <div className={styles.action} onClick={() => handleAction(workspace)}>
                          <RunIcon w={'1.5625rem'} />
                          <div className={styles.label}>
                            <div className={styles.arrow} />
                            <span>{t('Run workspace')}</span>
                          </div>
                        </div>
                      </header>
                      <Preview
                        $code
                        data-role="code"
                        tabIndex={0}
                        onClick={handlePreview}
                        onBlur={handlePreview}
                        onKeyDown={handlePreview}
                        style={{
                          fontFamily,
                          fontWeight,
                          color: theme.foreground,
                          cursor: 'inherit',
                          border: 'none',
                        }}
                      >
                        <Flex $column $isCode>
                          <pre dangerouslySetInnerHTML={{ __html: prefix }} />
                          <Flex $column>
                            {selected.commands ? (
                              selected.commands
                                .split('\n')
                                .map((command, index, array) => (
                                  <Flex key={index} $isCode>
                                    <pre
                                      dangerouslySetInnerHTML={{
                                        __html: symbol.replace('%', command),
                                      }}
                                    />
                                    {array.length - 1 === index && (
                                      <Cursor
                                        className={`cursor ${context.prompt === id ? 'focused' : 'hidden'}`}
                                        style={{ background: theme.cursor }}
                                      >
                                        &nbsp;
                                      </Cursor>
                                    )}
                                  </Flex>
                                ))
                            ) : (
                              <Flex>
                                <pre
                                  dangerouslySetInnerHTML={{
                                    __html: symbol.replace(
                                      '%',
                                      `<span style="color:${globalTheme.disabled};">${t('Type a command and press Enter to add another')}</span>`,
                                    ),
                                  }}
                                />
                                <Cursor
                                  className={`cursor ${context.prompt === id ? 'focused' : 'hidden'}`}
                                  style={{ background: theme.cursor }}
                                >
                                  &nbsp;
                                </Cursor>
                              </Flex>
                            )}
                          </Flex>
                        </Flex>
                        <style>
                          {`
                            ::selection {
                              background: ${theme.selectionBackground};
                              color: unset;
                            }
                          `}
                        </style>
                      </Preview>
                    </div>
                  </li>
                );
              })
              .toReversed()}
          </ul>
        ) : (
          <Fragment>
            <Placeholder role="alert">
              <PlusIcon />
              <span>{t('No workspaces yet')}</span>
              <span>
                {t('Create a workspace to start organizing your sessions')}
              </span>
            </Placeholder>
            <li className={`${styles.workspace} ${styles.workspaceExample}`}>
              <div className={styles.window}>
                <Preview
                  $code
                  style={{
                    fontFamily,
                    fontWeight,
                    color: theme.foreground,
                    cursor: 'inherit',
                    border: 'none',
                  }}
                >
                  <PromptExample theme={theme} />
                </Preview>
              </div>
            </li>
          </Fragment>
        )}
        <Placeholder style={{ display: 'none' }} role="alert">
          <SearchOffIcon />
          <span>{t('No workspaces found')}</span>
          <span>{t('Try a different search')}</span>
        </Placeholder>
      </div>
    </Fragment>
  );
};

export default memo(Workspaces);
