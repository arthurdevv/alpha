import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'preact/compat';

import { setSettings } from 'app/settings';
import { loadTheme } from 'app/common/themes';
import { formatKeysFlat } from 'app/keymaps/schema';
import { execCommand } from 'app/keymaps/commands';
import useStore from 'lib/store';
import useWorkspacesStore from 'lib/store/workspaces';
import { useUnmountWithStore } from 'lib/hooks/useUnmountWithStore';
import { getAllPrompts, getCurrentEntries } from 'lib/store/workspaces/helpers';
import { arrayToRecord, onFormSearch } from 'lib/utils';

import {
  GearsIcon,
  PlusIcon,
  RunIcon,
  SearchIcon,
  SearchOffIcon,
} from 'components/Icons';
import {
  Wrapper as Hint,
  Label as HintLabel,
} from 'lib/components/Settings/Config/styles';
import {
  KeyItem as HintKey,
  Keys as HintKeys,
} from 'lib/components/Terminal/Watermark/styles';
import { Form, FormItem, Placeholder, Title as Section } from '../styles';
import {
  Action,
  Arrow,
  Button,
  Header,
  Label,
  List,
  Mask,
  Name,
  Tab,
  Tabs,
  Title,
  Toolbar,
  Window,
  Workspace,
  Wrapper,
} from './styles';
import PromptExample from './example';
import WorkspaceGroup from './group';

const hintKeys = formatKeysFlat([
  'pane:split-horizontal',
  'pane:split-vertical',
  'pane:close',
]);

function getWorkspaces(context: WorkspacesState['context']): IWorkspace[] {
  const sortOptions: Intl.CollatorOptions = {
    sensitivity: 'base',
    numeric: true,
  };

  return Object.values(context).toSorted((a, b) =>
    a.name.localeCompare(b.name, undefined, sortOptions),
  );
}

function runWorkspaceCommand(workspace: IWorkspace | Partial<IWorkspace>) {
  execCommand('app:run-workspace', workspace);
}

function Workspaces({ options, store: _store, t }: SectionProps) {
  const { context, current, ...store } = useWorkspacesStore();

  const settings = useStore(s => s.options as ISettings);

  const [hasFocused, setHasFocused] = useState<boolean>(false);

  const handleName = useCallback(
    ({ currentTarget }, id: string) => {
      const next = currentTarget.value.trim() || context[id].name;

      currentTarget.value = next;

      return store.updateWorkspace(id, 'name', next);
    },
    [context, store.updateWorkspace],
  );

  const handleEdit = useCallback(
    (event: MouseEvent, workspace: IWorkspace, index: number) => {
      event.stopPropagation();

      execCommand('app:modal', 'Workspace', () => {
        _store.setWorkspace(workspace, index);
      });
    },
    [_store],
  );

  useEffect(() => {
    const context = arrayToRecord(settings.workspaces);

    store.replaceState({
      context,
      prompts: getAllPrompts(context),
      current: getCurrentEntries(context),
    });
  }, [settings.workspaces, store.replaceState]);

  useUnmountWithStore(useWorkspacesStore, 'context', context => {
    const workspaces = getWorkspaces(context);

    setSettings('workspaces', workspaces);
  });

  useEffect(() => {
    const timeout = setTimeout(
      () => setHasFocused(Boolean(current.focused)),
      100,
    );

    return () => {
      clearTimeout(timeout);
    };
  }, [current.focused]);

  const theme = useMemo(() => loadTheme(settings.theme), [settings.theme]);

  const workspaces = useMemo(() => getWorkspaces(context), [context]);

  return (
    <>
      <Section style={{ marginTop: 0 }} role="section">
        <span style={{ marginRight: 'auto' }}>{t('Workspaces')}</span>
        <Toolbar $hasFocused={hasFocused}>
          <Hint $element="Workspaces" style={{ marginLeft: 'auto' }}>
            <HintLabel>{t('Use')}</HintLabel>
            <HintKeys>
              {hintKeys.map((keys, index) => (
                <Fragment key={index}>
                  {keys.map(key => (
                    <HintKey key={key}>{key}</HintKey>
                  ))}
                  {index === 0 && <HintLabel>{t('/')}</HintLabel>}
                  {index === 1 && <HintLabel>{t('to split or')}</HintLabel>}
                  {index === 2 && (
                    <HintLabel>{t('to close the pane')}</HintLabel>
                  )}
                </Fragment>
              ))}
            </HintKeys>
          </Hint>
          <Form style={{ marginLeft: 0 }}>
            <FormItem style={{ width: '5rem' }}>
              <input
                placeholder={t('Search')}
                onClick={onFormSearch}
                onBlur={onFormSearch}
                onChange={onFormSearch}
              />
              <SearchIcon />
            </FormItem>
            <FormItem onClick={() => store.createWorkspace(t)}>
              {t('New workspace')}
            </FormItem>
          </Form>
        </Toolbar>
      </Section>
      {options}
      <Wrapper className={`w ${workspaces.length === 0 ? 'blank' : ''}`}>
        {workspaces.length ? (
          <List role="list">
            {workspaces.map((workspace, i, arr) => {
              const { id, name, tabs } = workspace;

              const index = current.tabs[id];

              const props: WorkspaceGroupProps = {
                ...store,
                ...settings,
                ...tabs[index],
                theme,
                focused: current.focused,
              };

              return (
                <Workspace
                  key={id}
                  data-name={name}
                  style={{ animationDelay: `${(arr.length - 1 - i) / 5}s` }}
                >
                  <Name
                    defaultValue={name}
                    placeholder={name}
                    onBlur={e => handleName(e, id)}
                  />
                  <Window
                    data-role="window"
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <Header>
                      <Tabs role="tablist">
                        {tabs.map((tab, i) => (
                          <Tab
                            key={tab.id}
                            $isCurrent={index === i}
                            $tabWidth={settings.tabWidth}
                            onClick={() => store.setCurrentTab(id, i)}
                          >
                            <Mask />
                            <Title title={tab.title}>{tab.title}</Title>
                            <Button
                              onClick={e => handleEdit(e, workspace, i)}
                              style={{ right: '1.875rem' }}
                            >
                              <GearsIcon />
                              <Label>
                                <Arrow />
                                <span>{t('Edit tab')}</span>
                              </Label>
                            </Button>
                            <Button
                              onClick={() =>
                                runWorkspaceCommand({ tabs: [tab] })
                              }
                            >
                              <RunIcon w={'1rem'} />
                              <Label>
                                <Arrow />
                                <span>{t('Run tab')}</span>
                              </Label>
                            </Button>
                          </Tab>
                        ))}
                      </Tabs>
                      <Action onClick={() => store.createTab(workspace)}>
                        <PlusIcon />
                        <Label>
                          <Arrow />
                          <span>{t('New tab')}</span>
                        </Label>
                      </Action>
                      <Action onClick={() => runWorkspaceCommand(workspace)}>
                        <RunIcon w={'1.5625rem'} />
                        <Label>
                          <Arrow />
                          <span>{t('Run workspace')}</span>
                        </Label>
                      </Action>
                    </Header>
                    <WorkspaceGroup {...props} />
                  </Window>
                </Workspace>
              );
            })}
          </List>
        ) : (
          <>
            <Placeholder role="alert">
              <PlusIcon />
              <span>{t('No workspaces yet')}</span>
              <span>
                {t('Create a workspace to start organizing your sessions')}
              </span>
            </Placeholder>
            <Workspace $isExample>
              <Window style={{ minHeight: '5rem', maxHeight: '5rem' }}>
                <PromptExample settings={settings} theme={theme} />
              </Window>
            </Workspace>
          </>
        )}
        <Placeholder style={{ display: 'none' }} role="alert">
          <SearchOffIcon />
          <span>{t('No workspaces found')}</span>
          <span>{t('Try a different search')}</span>
        </Placeholder>
      </Wrapper>
    </>
  );
}

export default memo(Workspaces);
