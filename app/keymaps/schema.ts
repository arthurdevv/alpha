import { getKeymaps, writeKeymaps, execCommand } from '.';

export function parseKeys(command: string, initial?: boolean) {
  const { size } = new Set(
    [false, true].map(value => getKeymaps(value)[command][0]),
  );

  const handleReset = (stateUpdater: Function) => {
    const changedKeys = getKeymaps();

    changedKeys[command] = getKeymaps(true)[command];

    writeKeymaps(changedKeys);

    stateUpdater();
  };

  const keys = getKeymaps(initial)[command][0].split('+');

  return { keys, changed: size !== 1, handleReset };
}

const schema: Record<string, string> = {
  'terminal:create': 'New Terminal',
  'window:create': 'New Window',
  'terminal:clear': 'Clear Terminal',
  'terminal:close': 'Close Current Terminal',
  'terminal:search': 'Search',
  'terminal:settings': 'Settings',
  'terminal:commands': 'Command Palette',
  'tab:next': 'Move To Next Tab',
  'tab:previous': 'Move To Previous Tab',
  'window:devtools': 'Toggle Developer Tools',
};

const menuCommands: Record<string, IMenuCommand[]> = {
  Terminal: [
    {
      name: 'New Terminal',
      keys: ['Ctrl', '⇧', 't'],
      action: () => execCommand('terminal:create'),
    },
    {
      name: 'Profiles',
      keys: [],
      action: () => execCommand('terminal:profiles'),
    },
    {
      name: 'Settings',
      keys: ['Ctrl', ','],
      action: () => execCommand('terminal:settings'),
    },
  ],
  Help: [
    {
      name: 'Toggle Developer Tools',
      keys: ['Ctrl', '⇧', 'i'],
      action: () => execCommand('window:devtools'),
    },
  ],
};

export { schema, menuCommands };
