import * as pty from 'node-pty';
import { existsSync } from 'fs';
import { isAbsolute, resolve } from 'path';
import { appDir } from 'app/settings/constants';

export const processes: Record<string, Process> = {};

function resolveCWD(path: string | null | undefined): string {
  const cwd = process.cwd();

  if (path && isAbsolute(path)) {
    if (existsSync(path)) return resolve(path);

    console.error('[ERROR] The specified path does not exist:', path);
  }

  if (process.env.ALPHA_CLI || cwd !== appDir) {
    return cwd;
  }

  return process.env.USERPROFILE!;
}

class Process {
  process!: pty.IPty;

  options: IProcessOptions;

  constructor(
    private ipc: IPC,
    private id: string,
    public profile: IProfile,
    options: IProcessOptions,
  ) {
    this.options = options;

    this.spawn(options);
  }

  spawn({ shell, args, env, cwd }: IProcessOptions): void {
    const defaultOptions: pty.IWindowsPtyForkOptions = {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      useConpty: true,
      cwd: resolveCWD(cwd),
      env: Object.assign(process.env, env),
    };

    this.process = pty.spawn(shell, args, defaultOptions);

    this.process.onData(data => {
      this.ipc.send('terminal:write', { id: this.id, data });
    });
  }

  write(data: string): void {
    this.process.write(data);
  }

  resize({ cols, rows }: IViewport): void {
    this.process.resize(cols, rows);
  }

  clear(): void {
    this.process.clear();
  }

  kill(): void {
    try {
      process.kill(this.process.pid);
    } catch (error) {
      console.log(error);
    }

    delete processes[this.id];
  }
}

export default Process;
