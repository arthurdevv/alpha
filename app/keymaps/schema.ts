import listeners from 'app/settings/listeners';
import { getKeymaps } from '.';

export const schema: Record<string, string> = {
  'app:profiles': 'Profiles',
  'app:settings': 'Settings',
  'app:commands': 'Show all commands',
  'app:keymaps': 'Show all keymaps',
  'terminal:create': 'New terminal',
  'terminal:clear': 'Clear terminal',
  'terminal:search': 'Search',
  'terminal:history': 'History',
  'terminal:snippets': 'Snippets',
  'terminal:copy': 'Copy',
  'terminal:paste': 'Paste',
  'terminal:select-all': 'Select all',
  'terminal:zen-mode': 'Zen mode',
  'process:reconnect': 'Reconnect client',
  'process:disconnect': 'Disconnect client',
  'pane:split-horizontal': 'Split horizontal',
  'pane:split-vertical': 'Split vertical',
  'pane:broadcast': 'Broadcast',
  'pane:expand': 'Expand pane',
  'pane:collapse': 'Collapse pane',
  'pane:focus-next': 'Focus next pane',
  'pane:focus-previous': 'Focus previous pane',
  'pane:focus-by-number': 'Focus pane by number',
  'pane:resize-up': 'Resize pane up',
  'pane:resize-right': 'Resize pane right',
  'pane:resize-down': 'Resize pane down',
  'pane:resize-left': 'Resize pane left',
  'pane:close': 'Close pane',
  'tab:next': 'Next tab',
  'tab:previous': 'Previous tab',
  'tab:select-by-number': 'Select tab by number',
  'tab:rename': 'Rename tab',
  'tab:close': 'Close tab',
  'tab:reopen-closed': 'Reopen closed tab',
  'window:create': 'New window',
  'window:fullscreen': 'Toggle fullscreen',
  'window:devtools': 'Toggle developer tools',
  'window:toggle-visibility': 'Toggle window visibility',
};

export const boundCommands: Record<string, Record<string, any>> = {
  app: {
    modal: ['commands', 'profiles', 'keymaps'],
  },
  terminal: {
    action: ['copy', 'paste', 'select-all', 'clear', 'focus', 'connected'],
    modal: ['search', 'history', 'snippets'],
  },
  pane: {
    action: ['expand', 'collapse', 'broadcast'],
    layout: [
      'vertical',
      'horizontal',
      'next',
      'previous',
      'up',
      'right',
      'down',
      'left',
    ],
  },
  tab: {
    action: [
      'rename',
      'color',
      'duplicate',
      'reopen-closed',
      'close',
      'close-others',
      'close-right',
    ],
    layout: ['next', 'previous'],
  },
  process: {
    action: ['clear', 'kill', 'disconnect', 'reconnect'],
  },
};

function parseKeys(command: string, initial?: boolean) {
  const keymaps = getKeymaps(initial);

  let keys: string[] | string[][] = command in keymaps ? keymaps[command] : [];

  if (keys.length > 0) {
    keys = keys.map(value => value.split('+'));

    return keys;
  }

  return [];
}

function formatKeys(command: string, initial?: boolean) {
  const keys = parseKeys(command, initial);

  return keys.map(keys =>
    keys.map(key => {
      switch (key) {
        case 'shift':
          return '⇧';

        case 'enter':
          return '↵';

        case ' ':
          return 'space';

        default:
          return key;
      }
    }),
  );
}

function resolveCommand(command: string) {
  if (command in schema) {
    const [keys] = formatKeys(command);

    return { label: schema[command], keys };
  }

  return { label: command, keys: [] };
}

function watchKeys(command: string, callback: Function, format = true) {
  listeners.subscribe('keymaps', () => {
    const [keys = []] = format ? formatKeys(command) : parseKeys(command);

    callback(keys);
  });
}

function watchKeymaps(callback: (keymaps: Set<string>) => void) {
  listeners.subscribe('keymaps', () => {
    const keymaps = new Set<string>(getKeymaps(false, true) as any);

    callback(keymaps);
  });
}

function watchCommand(command: string, callback: (keymaps: string[]) => void) {
  if (command !== 'window:toggle-visibility') return;

  listeners.subscribe('keymaps', () => {
    const keymaps = getKeymaps()[command];

    callback(keymaps);
  });
}

export {
  parseKeys,
  formatKeys,
  resolveCommand,
  watchKeys,
  watchKeymaps,
  watchCommand,
};
