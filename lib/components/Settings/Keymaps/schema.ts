import { getKeymaps } from 'app/keymaps';

export function parseKeys(command: string) {
  const keymaps = getKeymaps();

  return keymaps[command][0].split('+');
}

const schema: Record<string, string> = {
  'terminal:create': 'New Terminal',
  'terminal:clear': 'Clear Terminal',
  'terminal:close': 'Close Current Terminal',
  'terminal:search': 'Search',
  'terminal:settings': 'Settings',
  'terminal:commands': 'Command Palette',
  'tab:next': 'Move To Next Tab',
  'tab:previous': 'Move To Previous Tab',
  'window:devtools': 'Toggle Developer Tools',
};

export default schema;
