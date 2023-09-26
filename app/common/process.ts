import * as pty from 'node-pty';
import { homedir } from 'os';
import { terms } from './terminal';

export const processes: Record<string, pty.IPty | null> = {};

const defaultOptions: pty.IWindowsPtyForkOptions = {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: homedir(),
  env: Object(process.env),
};

function createProcess(
  { shell, args }: IProcessParam,
  customOptions?: pty.IWindowsPtyForkOptions | {},
) {
  const options = defaultOptions;

  if (customOptions) {
    Object.keys(customOptions).forEach(key => {
      const hasValue = Boolean(customOptions[key]);

      options[key] = (hasValue ? customOptions : defaultOptions)[key];
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
