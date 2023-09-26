import { execCommand } from 'app/keymaps';

const commands: MenuCommands = {
  'New Terminal': {
    keys: isMac ? ['⌘', 't'] : ['Ctrl', '⇧', 't'],
    exec: () => execCommand('terminal:create'),
  },
  Profiles: {
    keys: isMac ? ['⌘', 'k'] : ['Ctrl', '⇧', 'k'],
    exec: () => execCommand('terminal:profiles'),
  },
  Settings: {
    keys: [isMac ? '⌘' : 'Ctrl', ','],
    exec: () => execCommand('terminal:settings'),
  },
  'Toggle Developer Tools': {
    keys: isMac ? ['⌘', 'Alt', 'i'] : ['Ctrl', '⇧', 'i'],
    exec: () => execCommand('window:devtools'),
  },
};

export default commands;
