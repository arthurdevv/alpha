import listeners from 'app/settings/listeners';
import { getKeymaps } from '.';

const schema: Record<string, string> = {
  'terminal:create': 'New terminal',
  'terminal:clear': 'Clear terminal',
  'terminal:close': 'Close terminal',
  'terminal:search': 'Search',
  'app:profiles': 'Profiles',
  'app:settings': 'Settings',
  'app:commands': 'Command palette',
  'terminal:copy': 'Copy',
  'terminal:paste': 'Paste',
  'terminal:selectAll': 'Select all',
  'pane:broadcast': 'Broadcast',
  'pane:expand': 'Expand/collapse pane',
  'pane:next': 'Move to next pane',
  'pane:previous': 'Move to previous pane',
  'pane:close': 'Close pane',
  'pane:split-horizontal': 'Split horizontal',
  'pane:split-vertical': 'Split vertical',
  'tab:next': 'Next tab',
  'tab:previous': 'Previous tab',
  'window:create': 'New window',
  'window:fullscreen': 'Toggle fullscreen',
  'window:devtools': 'Toggle developer tools',
};

const boundCommands: Record<string, Record<string, string[]>> = {
  tab: {
    move: ['next', 'previous'],
  },
  pane: {
    move: ['next', 'previous'],
    split: ['vertical', 'horizontal'],
    action: ['expand', 'broadcast'],
  },
  terminal: {
    action: ['copy', 'paste', 'selectAll', 'clear', 'focus'],
  },
  app: {
    modal: ['commands', 'profiles'],
  },
};

const paletteCommands: Record<string, string[]> = {
  Terminal: ['New terminal', 'Profiles', 'Settings'],
  Window: ['New window'],
  Help: ['Toggle developer tools'],
};

function parseKeys(command: string, initial?: boolean) {
  const [keys] = getKeymaps(initial)[command];

  return keys.split('+');
}

function formatKeys(command: string, initial?: boolean) {
  const keys = parseKeys(command, initial);

  return keys.map(key => {
    switch (key) {
      case 'shift':
        return '⇧';

      case 'enter':
        return '↵';

      default:
        return key;
    }
  });
}

function watchKeys(command: string, callback: Function, format = true) {
  listeners.subscribe('keymaps', () =>
    callback(format ? formatKeys(command) : parseKeys(command)),
  );
}

function getPaletteSchema(label: string) {
  const command = Object.keys(schema).find(value => schema[value] === label);

  if (command) {
    const keys = formatKeys(command);

    return { command, keys };
  }

  return { command: '', keys: [] };
}

export {
  schema,
  boundCommands,
  paletteCommands,
  parseKeys,
  formatKeys,
  watchKeys,
  getPaletteSchema,
};
