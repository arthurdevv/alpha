import yaml from 'js-yaml';
import Mousetrap, { MousetrapInstance } from 'mousetrap';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { keymapsPath, userKeymapsPath } from 'app/settings/constants';

const mousetrap: MousetrapInstance = new (Mousetrap as any)(window);

const commands: Record<string, Function> = {};

function assignCommand(command: string) {
  commands[command] = (...args: any[]) => {
    if (command.includes('app') || command.includes('window')) {
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

const getNumericKeys = (): Record<string, string[]> => {
  const keys: Record<string, string[]> = {};

  for (let i = 1; i <= 9; i += 1) {
    const index = i === 9 ? 9 : i;

    keys[`tab:${index}`] = [`ctrl+${i}`];

    const commandIndex = i === 9 ? 9 : i - 1;

    commands[`tab:${index}`] = () => {
      window.emit(`tab:specific`, commandIndex);
    };
  }

  return keys;
};

const getKeymaps = (initial?: boolean): Record<string, string[]> => {
  let keymaps: Record<string, string[]> = {};

  try {
    const content = readFileSync(
      initial ? keymapsPath : userKeymapsPath,
      'utf-8',
    );

    keymaps = yaml.load(content) as typeof keymaps;
  } catch (error) {
    console.error(error);
  }

  Object.keys(keymaps).forEach(command => {
    assignCommand(command);
  });

  const numericKeys = getNumericKeys();

  keymaps = Object.assign(keymaps, numericKeys);

  return keymaps;
};

function writeKeymaps(keymaps: Record<string, string[]>) {
  try {
    const content = yaml.dump(keymaps, { indent: 2 });

    writeFileSync(userKeymapsPath, content, 'utf-8');
  } catch (error) {
    console.error(error);
  }
}

const hasKeymapsFile = existsSync(userKeymapsPath);

if (!hasKeymapsFile) {
  const keymaps = getKeymaps(true);

  writeKeymaps(keymaps);
}

export { commands, mousetrap, execCommand, getKeymaps, writeKeymaps };
