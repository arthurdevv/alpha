import { homedir } from 'os';
import { existsSync } from 'fs';
import { isAbsolute } from 'path';
import * as pty from 'node-pty';
import { appDir } from 'app/settings/constants';
import { terms } from './terminal';

export const processes: Record<string, IProcessFork> = {};

const defaultOptions: pty.IWindowsPtyForkOptions = {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  env: Object(process.env),
  useConpty: true,
};

const getExistingCWD = (path: string | undefined) => {
  const cwd = process.cwd();

  if (path && isAbsolute(path) && existsSync(path)) {
    return path;
  }

  if (process.env.ALPHA_CLI || cwd !== appDir) {
    return cwd;
  }

  return homedir();
};

function createProcess({ shell, args, cwd, env }: IProcess) {
  const options = Object.assign(defaultOptions, {
    cwd: getExistingCWD(cwd),
    env: Object.assign(window.process.env, env),
  });

  try {
    const process = pty.spawn(shell, args || [], options);

    process.onData(data => {
      const id = Object.keys(processes).find(
        id => processes[id].pty === process,
      );

      if (id) {
        const term = terms[id];

        if (term) {
          term.write(data);
        }
      }
    });

    return { pty: process, shell, args };
  } catch (error) {
    console.error(error);
  }
}

export default createProcess;
