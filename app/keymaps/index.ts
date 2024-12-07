import yaml from 'js-yaml';
import Mousetrap, { MousetrapInstance } from 'mousetrap';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { commands, execCommand } from 'app/keymaps/commands';
import { keymapsPath, userKeymapsPath } from 'app/settings/constants';

export const mousetrap: MousetrapInstance = new (Mousetrap as any)(window);

function getNumericKeys(): Record<string, string[]> {
  const keys: Record<string, string[]> = {};

  for (let i = 1; i <= 9; i += 1) {
    const index = i === 9 ? 9 : i;

    keys[`tab:${index}`] = [`ctrl+${i}`];

    commands[`tab:${index}`] = () => {
      execCommand(`tab:move`, i === 9 ? 9 : i - 1);
    };
  }

  return keys;
}

function getKeymaps(initial?: boolean): Record<string, string[]> {
  let keymaps: Record<string, string[]> = {};

  try {
    const exists = existsSync(userKeymapsPath);

    const content = readFileSync(
      initial || !exists ? keymapsPath : userKeymapsPath,
      'utf-8',
    );

    keymaps = yaml.load(content) as typeof keymaps;

    if (!exists) writeKeymaps(keymaps);
  } catch (error) {
    console.error(error);
  }

  keymaps = Object.assign(keymaps, getNumericKeys());

  return keymaps;
}

function writeKeymaps(keymaps: Record<string, string[]>): void {
  try {
    const content = yaml.dump(keymaps, { indent: 2 });

    writeFileSync(userKeymapsPath, content, 'utf-8');
  } catch (error) {
    console.error(error);
  }
}

function bindKeymaps(): void {
  const keymaps = getKeymaps();

  mousetrap.reset().stopCallback = () => false;

  Object.keys(keymaps).forEach(command => {
    const [keys] = keymaps[command];

    mousetrap.bind(
      keys,
      event => {
        event.preventDefault();

        execCommand(command);
      },
      'keydown',
    );
  });
}

export { getKeymaps, writeKeymaps, bindKeymaps };
