import { readFileSync } from 'fs';
import { join } from 'path';
import { appPath } from 'app/settings/constants';
import { commands } from './commands';

const keymapsPath = join(
  appPath,
  'app/common/keymaps/json',
  `${process.platform}.json`,
);

const getSpecificKeys = (): Record<string, string> => {
  const keys: Record<string, string> = {};

  for (let i = 1; i <= 9; i += 1) {
    const index = i === 9 ? 9 : i;

    keys[`tab.${index}`] = `ctrl+${i}`;

    const commandIndex = i === 9 ? 9 : i - 1;

    commands[`tab.${index}`] = () => {
      global.emit('tab-move-to-specific', commandIndex);
    };
  }

  return keys;
};

const getKeymapsParsed = (): Record<string, string> => {
  let keymaps: Record<string, string> = {};

  try {
    keymaps = JSON.parse(readFileSync(keymapsPath, 'utf-8'));
  } catch (error) {
    console.error(error);
  }

  Object.keys(keymaps).forEach(key => {
    if (key.endsWith('.specific')) {
      const specific = getSpecificKeys();

      keymaps = Object.assign(keymaps, specific);
    }
  });

  return keymaps;
};

export { getKeymapsParsed };
