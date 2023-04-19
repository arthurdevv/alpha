import yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { keymapsPath } from 'app/settings/constants';
import { commands } from './commands';

const getSpecificKeys = (): Record<string, string> => {
  const keys: Record<string, string> = {};

  for (let i = 1; i <= 9; i += 1) {
    const index = i === 9 ? 9 : i;

    keys[`tab-${index}`] = `ctrl+${i}`;

    const commandIndex = i === 9 ? 9 : i - 1;

    commands[`tab-${index}`] = () => {
      global.emit('tab-move-to-specific', commandIndex);
    };
  }

  return keys;
};

const getKeymapsParsed = (): Record<string, string> => {
  let keymaps = {};

  try {
    keymaps = yaml.load(readFileSync(keymapsPath, 'utf-8')) as typeof keymaps;
  } catch (error) {
    console.error(error);
  }

  Object.keys(keymaps).forEach(key => {
    const mapping = keymaps[key];

    if (typeof mapping === 'object') {
      keymaps[key] = mapping[0];
    }

    if (key.endsWith('-specific')) {
      const specificKeys = getSpecificKeys();

      keymaps = Object.assign(keymaps, specificKeys);
    }
  });

  return keymaps;
};

export { getKeymapsParsed };
