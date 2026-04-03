export const KEY_SYMBOLS: Record<string, string> = {
  shift: '⇧',
  meta: '⊞',
  enter: '↵',
  tab: '↹',
  capslock: '⇪',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  ' ': 'space',
};

const NUMPAD_MAP: Record<string, string> = {
  add: '+',
  subtract: '-',
  multiply: '*',
  divide: '/',
  decimal: '.',
  enter: 'enter',
};

const SPECIAL_KEYS: Record<string, string> = {
  Escape: 'esc',
  Enter: 'enter',
  Tab: 'tab',
  Backspace: 'backspace',
  Delete: 'del',
  Insert: 'insert',
  Home: 'home',
  End: 'end',
  PageUp: 'pageup',
  PageDown: 'pagedown',
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  Space: 'space',
};

const MODIFIERS = ['ctrl', 'shift', 'alt', 'meta'];

export function normalizeKeyCombo({
  code,
  key,
  ctrlKey,
  altKey,
  shiftKey,
  metaKey,
}: KeyboardEvent): string {
  const combo: string[] = [];

  if (ctrlKey) combo.push('ctrl');
  if (altKey) combo.push('alt');
  if (shiftKey) combo.push('shift');
  if (metaKey) combo.push('meta');

  let base: string | null = null;

  if (code.startsWith('Key')) {
    base = code.slice(3).toLowerCase();
  } else if (code.startsWith('Digit')) {
    base = code.slice(5);
  } else if (code.startsWith('Numpad')) {
    const n = code.slice(6).toLowerCase();
    base = NUMPAD_MAP[n] ?? `num${n}`;
  } else {
    base = SPECIAL_KEYS[code] ?? null;
  }

  if (!base && key.length === 1) base = key.toLowerCase();
  if (base && !MODIFIERS.includes(base)) combo.push(base);

  return combo.join('+');
}
