import { terms } from 'app/common/terminal';

const mainSchema: Record<string, string[]> = {
  Terminal: ['terminal:create', 'app:profiles', 'app:settings'],
  Window: ['window:create'],
  Help: ['window:devtools'],
};

const instanceSchema = {
  Connection: ['process:reconnect', 'process:disconnect'],
  Terminal: [
    'terminal:create',
    'terminal:clear',
    'terminal:search',
    'terminal:history',
    'terminal:snippets',
    'terminal:copy',
    'terminal:paste',
    'terminal:select-all',
    'app:profiles',
    'app:settings',
  ],
  Panes: [
    'pane:expand',
    'pane:collapse',
    'pane:broadcast',
    'pane:split-horizontal',
    'pane:split-vertical',
  ],
  Tabs: ['tab:rename', 'tab:duplicate', 'tab:close', 'tab:reopen-closed'],
  Window: ['window:create'],
  Help: ['window:devtools'],
};

function filterCommand(section: string, command: string) {
  schema[section] = schema[section].filter(
    (value: string) => !value.includes(command),
  );

  return schema;
}

let schema: Record<string, string[]> = {};

export default ({
  context,
  instances,
  session,
  current: { focused, origin },
}: AlphaState) => {
  const term = focused ? terms[focused] : null;
  const tab = origin ? context[origin] : null;
  const instance = focused ? instances[focused] : null;

  if (origin === 'Settings') return mainSchema;

  if (term && tab && instance) {
    schema = { ...instanceSchema };

    if (instance.profile.type === 'shell') delete schema.Connection;

    if (!term.hasSelection) schema = filterCommand('Terminal', 'copy');
    if (!term.hasClipboard) schema = filterCommand('Terminal', 'paste');

    if (instance.isExpanded) {
      schema = filterCommand('Panes', 'split');
      schema = filterCommand('Panes', 'expand');
      schema = filterCommand('Panes', 'broadcast');
    } else {
      schema = filterCommand('Panes', 'collapse');
    }

    if (tab.children.length <= 1) {
      schema = filterCommand('Panes', 'expand');
      schema = filterCommand('Panes', 'collapse');
      schema = filterCommand('Panes', 'broadcast');
    }

    if (!session.group || session.instances.length === 0) {
      schema = filterCommand('Tabs', 'reopen');
    }

    return schema;
  }

  return mainSchema;
};
