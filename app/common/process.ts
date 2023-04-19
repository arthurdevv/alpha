import * as pty from 'node-pty';
import { app } from '@electron/remote';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';
import { getSettings } from 'app/settings';
import defaultShell from 'app/utils/default-shell';

const sessions: Map<string, Process> = new Map<string, Process>();

const setSession = (profile?: IProfile | undefined) => {
  const settings = getSettings(undefined);

  const id = uuidv4();

  const cwd =
    settings.cwd && existsSync(settings.cwd)
      ? settings.cwd
      : app.getPath('home');

  const shell = profile?.shell || defaultShell;

  const args = profile?.args || [];

  const options: IProcessOptions = {
    id,
    cwd,
    shell,
    args,
    env: Object.assign(process.env),
    useConpty: Boolean(settings.useConpty),
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

  public spawn({
    id,
    cwd,
    shell,
    args,
    env,
    useConpty,
  }: IProcessOptions): void {
    const options: pty.IWindowsPtyForkOptions = {
      name: 'xterm-256color',
      cwd,
      env,
      useConpty,
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
