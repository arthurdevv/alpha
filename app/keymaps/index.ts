import yaml from 'js-yaml';
import Mousetrap, { MousetrapInstance } from 'mousetrap';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { commands, execCommand } from 'app/keymaps/commands';
import { keymapsPath, userKeymapsPath } from 'app/settings/constants';
import { reportError } from 'shared/error-reporter';

export const mousetrap: MousetrapInstance = new (Mousetrap as any)(window);

const SPECIAL_KEYS = new Set([
  'enter',
  'tab',
  'backspace',
  'delete',
  'escape',
  'home',
  'end',
  'pageup',
  'pagedown',
  'capslock',
  'f1',
  'f2',
  'f3',
  'f4',
  'f5',
  'f6',
  'f7',
  'f8',
  'f9',
  'f10',
  'f11',
  'f12',
]);

function getNumericKeys(): Record<string, string[]> {
  const keys: Record<string, string[]> = {};

  for (let i = 1; i <= 9; i += 1) {
    const index = i === 9 ? 9 : i - 1;

    keys[`tab:${i}`] = [`ctrl+${i}`];

    commands[`tab:${i}`] = () => {
      execCommand(`tab:layout`, index);
    };

    keys[`pane:${i}`] = [`alt+${i}`];

    commands[`pane:${i}`] = () => {
      execCommand(`pane:layout`, 'focus', index);
    };
  }

  return keys;
}

function getKeymaps(initial?: boolean, flat = false): Record<string, string[]> {
  let keymaps: Record<string, string[]> = {};

  try {
    const existsFile = existsSync(userKeymapsPath);

    const content = readFileSync(
      initial || !existsFile ? keymapsPath : userKeymapsPath,
      'utf-8',
    );

    keymaps = yaml.load(content) as typeof keymaps;

    if (!existsFile) writeKeymaps(keymaps);
  } catch (error) {
    reportError(error);
  }

  keymaps = Object.assign(keymaps, getNumericKeys());

  return flat ? (Object.values(keymaps).flat() as any) : keymaps;
}

function writeKeymaps(keymaps: Record<string, string[]>): void {
  try {
    const content = yaml.dump(keymaps, { indent: 2 });

    writeFileSync(userKeymapsPath, content, 'utf-8');
  } catch (error) {
    reportError(error);
  }
}

function bindKeymaps(): void {
  const keymaps = getKeymaps();

  mousetrap.reset().stopCallback = () => false;

  Object.keys(keymaps).forEach(command => {
    const keymap = keymaps[command];

    keymap.forEach(keys => {
      mousetrap.bind(
        keys,
        event => {
          event.preventDefault();

          execCommand(command);
        },
        'keydown',
      );
    });
  });
}

function normalizeKeyCombo({ key, ctrlKey, shiftKey, altKey }: KeyboardEvent) {
  const combo: string[] = [];

  if (ctrlKey) combo.push('ctrl');
  if (altKey) combo.push('alt');
  if (shiftKey) combo.push('shift');

  let k = key.toLowerCase();

  if (k.startsWith('arrow')) k = k.replace('arrow', '');
  if (k === ' ') k = 'space';
  if (k.length === 1 || SPECIAL_KEYS.has(k)) combo.push(k);

  return combo.join('+');
}

export { getKeymaps, writeKeymaps, bindKeymaps, normalizeKeyCombo };
