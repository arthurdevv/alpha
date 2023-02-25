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
  'window.reload': () => {
    global.send('window-reload');
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

export { commands, execCommand, hasCommand };
