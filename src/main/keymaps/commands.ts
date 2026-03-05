import ipc from 'shared/ipc/renderer';
import { boundCommands } from './schema';

const commands: Record<string, (...args: any[]) => void> = {};

function getBoundCommand(value: string): string[] | [string, string[]] {
  const [scope, action] = value.split(':');

  const context = boundCommands[scope];

  const [prefix, head] = value.split('-');

  if (!context || action.includes('zen')) return ['false'];

  if (head && scope !== 'tab' && !action.includes('all')) {
    if (scope === 'pane') {
      const [, action] = prefix.split(':');

      return [`${scope}:layout`, [action, head]];
    }

    return [`${prefix}`, head];
  }

  const key = Object.keys(context).find(k => context[k].includes(action));

  return key ? [`${scope}:${key}`, action] : [];
}

function assignCommand(command: string, ...args: any[]): void {
  const excluded = excludeCommands.includes(command);

  const method = excluded ? 'send' : 'emit';

  commands[command] = (...extraArgs: any[]) => {
    const [boundCommand, boundArgs] = getBoundCommand(command);

    const channel = excluded
      ? command
      : boundCommand === 'false'
        ? command
        : boundCommand || command;

    ipc[method](channel, ...args.concat(extraArgs, boundArgs));
  };
}

function execCommand(command: string, ...args: any[]) {
  if (!(command in commands)) assignCommand(command);

  const callback = args[args.length - 1];

  if (typeof callback === 'function') {
    callback();
    args.pop();
  }

  void commands[command](...args);

  return { execCommand };
}

function formatCommand(command: string): string {
  let [prefix, action] = command.split(':');

  action = action.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

  const capitalized = prefix.charAt(0).toUpperCase() + prefix.slice(1);

  return `${action}${capitalized}`;
}

const excludeCommands = [
  'app:check-for-updates',
  'app:save-session',
  'app:run-workspace',
  'terminal:create',
  'terminal:prepare-history',
  'process:write',
  'process:resize',
  'window:title',
  'window:create',
  'window:devtools',
  'window:fullscreen',
];

export { commands, assignCommand, execCommand, formatCommand };
