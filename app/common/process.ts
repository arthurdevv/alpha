import * as pty from 'node-pty';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';
import { app } from '@electron/remote';
import { getSettings } from 'app/settings';
import defaultShell from 'app/utils/default-shell';

const sessions: Map<string, Process> = new Map<string, Process>();

const setSession = (profile?: IProfile | undefined) => {
  const settings = getSettings();

  const id = uuidv4();

  const cwd = app.getPath('home');

  const shell = profile ? profile.shell : defaultShell;

  const args = profile
    ? [...new Set([...settings.args, ...profile.args])]
    : settings.args;

  const options: IProcessOptions = {
    id,
    cwd,
    shell,
    args,
    env: Object.assign(process.env, settings.env),
  };

  const session = new Process(options);

  sessions.set(id, session);

  return { session, options };
};

class Process extends EventEmitter {
  public process!: pty.IPty | null;

  constructor(options: IProcessOptions) {
    super();

    this.spawn(options);
  }

  public spawn({ id, cwd, shell, args, env }: IProcessOptions): void {
    const options: pty.IWindowsPtyForkOptions = {
      name: 'xterm-256color',
      cwd,
      env,
    };

    this.process = pty.spawn(shell, args, options);

    this.process.onData(data => {
      this.emit('data', { id, data });
    });

    this.process.onExit(() => {
      this.emit('kill');
    });
  }

  public write(data: string): void {
    if (this.process) {
      this.process.write(data);
    }
  }

  public kill(): void {
    if (this.process) {
      this.process.kill();
    }

    this.emit('kill');
  }
}

export { sessions, setSession };
