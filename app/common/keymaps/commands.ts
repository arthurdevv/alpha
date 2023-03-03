import { openSettings } from 'app/settings';

const execCommand = (command: string) => commands[command];

const hasCommand = (command: string) => command in commands;

const commands: Commands = {
  'terminal.create': () => {
    global.emit('terminal-create', {});
  },
  'terminal.clear': () => {
    global.emit('terminal-clear-buffer');
  },
  'terminal.close': () => {
    global.emit('terminal-dispose-current');
  },
  'terminal.settings': () => {
    openSettings();
  },
  'tab.next': () => {
    global.emit('tab-move-to-next');
  },
  'tab.previous': () => {
    global.emit('tab-move-to-previous');
  },
  'window.commands': () => {
    global.emit('window-show-commands');
  },
  'window.devtools': () => {
    global.send('window-toggle-devtools');
  },
  'window.fullscreen': () => {
    global.send('window-toggle-fullscreen');
  },
  'window.minimize': () => {
    global.send('window-minimize');
  },
  'window.close': () => {
    global.send('window-close');
  },
};

const menuCommands: MenuCommands = {
  Terminal: {
    'New Terminal': {
      keys: global.isMac ? ['⌘', 't'] : ['Ctrl', '⇧', 't'],
      onClick: () => commands['terminal.create'](),
    },
    'Clear Current Terminal': {
      keys: global.isMac ? ['⌘', 'k'] : ['Ctrl', '⇧', 'k'],
      onClick: () => commands['terminal.clear'](),
    },
    'Open Settings': {
      keys: [global.isMac ? '⌘' : 'Ctrl', ','],
      onClick: () => commands['terminal.settings'](),
    },
  },
  Tab: {
    'Go to Next Tab': {
      keys: ['Ctrl', 'Tab'],
      onClick: () => commands['tab.next'](),
    },
    'Go to Previous Tab': {
      keys: ['Ctrl', '⇧', 'Tab'],
      onClick: () => commands['tab.previous'](),
    },
  },
  Window: {
    'Toggle Developer Tools': {
      keys: global.isMac ? ['⌘', 'Alt', 'i'] : ['Ctrl', '⇧', 'i'],
      onClick: () => commands['window.devtools'](),
    },
    'Toggle Full Screen': {
      keys: global.isMac ? ['⌘', 'Ctrl', 'f'] : ['f11'],
      onClick: () => commands['window.fullscreen'](),
    },
    'Minimize Window': {
      keys: global.isMac ? ['⌘', 'm'] : ['Ctrl', '⇧', 'm'],
      onClick: () => commands['window.minimize'](),
    },
    'Close Window': {
      keys: global.isMac ? ['⌘', 'Shift', 'w'] : ['Alt', 'f4'],
      onClick: () => commands['window.close'](),
    },
  },
};

export { commands, menuCommands, execCommand, hasCommand };
