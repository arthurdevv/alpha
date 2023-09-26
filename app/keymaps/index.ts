import yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { keymapsPath } from 'app/settings/constants';

const commands: Record<string, Function> = {};

function assignCommand(command: string) {
  commands[command] = (...args: any[]) => {
    if (command.includes('window')) {
      window.send(command, ...args);
    } else {
      window.emit(command, ...args);
    }
  };
}

function execCommand(command: string, ...args: any[]): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    resolve(true);

    if (!Object.prototype.hasOwnProperty.call(commands, command)) {
      assignCommand(command);
    }

    void commands[command](...args);
  });
}

const getNumericKeys = (): Record<string, string> => {
  const keys: Record<string, string> = {};

  for (let i = 1; i <= 9; i += 1) {
    const index = i === 9 ? 9 : i;

    keys[`tab:${index}`] = `ctrl+${i}`;

    const commandIndex = i === 9 ? 9 : i - 1;

    commands[`tab:${index}`] = () => {
      window.emit(`tab:specific`, commandIndex);
    };
  }

  return keys;
};

const getKeymapsParsed = (): Record<string, string> => {
  let keymaps: Record<string, string> = {};

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

    assignCommand(key);
  });

  const numericKeys = getNumericKeys();

  keymaps = Object.assign(keymaps, numericKeys);

  return keymaps;
};

const keymaps = getKeymapsParsed();

export { commands, keymaps, execCommand };
