import * as pty from 'node-pty';
import { homedir } from 'os';
import { existsSync } from 'fs';
import { isAbsolute } from 'path';
import { terms } from './terminal';
import { appDir } from 'app/settings/constants';

export const processes: Record<string, pty.IPty | null> = {};

const defaultOptions: pty.IWindowsPtyForkOptions = {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  env: Object(process.env),
};

const getExistingCWD = (path: string) => {
  const cwd = process.cwd();

  if (path && isAbsolute(path) && existsSync(path)) {
    return path;
  }

  if (process.env.ALPHA_CLI || cwd !== appDir) {
    return cwd;
  }

  return homedir();
};

function createProcess(
  { shell, args }: IProcessParam,
  customOptions?: pty.IWindowsPtyForkOptions,
) {
  const options = defaultOptions;

  if (customOptions) {
    Object.keys(customOptions).forEach(key => {
      const value = customOptions[key];

      options[key] = key === 'cwd' ? getExistingCWD(value) : value;
    });
  }

  const process = pty.spawn(shell, args, options);

  process.onData(data => {
    const id = Object.keys(processes).find(id => processes[id] === process);

    if (id) {
      const term = terms[id];

      if (term) {
        term.write(data);
      }
    }
  });

  return { process, shell };
}

export default createProcess;
