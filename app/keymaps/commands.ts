import ipc from 'shared/renderer';
import { boundCommands } from './schema';

const commands: Record<string, (...args: any[]) => void> = {};

function getBoundCommand(value: string): typeof command {
  const [scope, action] = value.split(':');

  const context = boundCommands[scope];

  let command: (string | undefined)[] = [];

  if (context) {
    const [prefix, head] = value.split('-');

    if (head) {
      command = [`${prefix}`, head];
    } else {
      Object.keys(context).forEach(key => {
        if (context[key].includes(action)) {
          command = [`${scope}:${key}`, action];
        }
      });
    }
  }

  return command;
}

function assignCommand(command: string, ...args: any[]): void {
  const excluded = excludeCommands.includes(command);

  const method = excluded ? 'send' : 'emit';

  commands[command] = (...extraArgs: any[]) => {
    const [boundCommand, boundArgs] = getBoundCommand(command);

    const channel = excluded ? command : boundCommand || command;

    ipc[method](channel, ...args.concat(extraArgs, boundArgs));
  };
}

function execCommand(command: string, ...args: any[]): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    if (!(command in commands)) assignCommand(command);

    void commands[command](...args);

    resolve(true);
  });
}

const excludeCommands = [
  'app:check-for-updates',
  'app:save-session',
  'terminal:create',
  'process:write',
  'process:resize',
  'window:title',
  'window:create',
  'window:devtools',
  'window:fullscreen',
];

export { commands, assignCommand, execCommand };
