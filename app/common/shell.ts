import * as pty from 'node-pty';
import { homedir } from 'os';
import { existsSync } from 'fs';
import { isAbsolute, resolve } from 'path';
import { appDir } from 'app/settings/constants';
import Logger from 'app/common/logger';

function resolveCWD(path: string | null | undefined): string {
  const cwd = process.cwd();

  if (path && isAbsolute(path) && existsSync(path)) {
    return resolve(path);
  }

  if (process.env.ALPHA_CLI || cwd !== appDir) {
    return cwd;
  }

  return process.env.USERPROFILE || homedir();
}

class Shell extends Logger {
  pty!: pty.IPty;

  constructor(options: IShellOptions, { id, profile }: IInstance, ipc: IPC) {
    super(id, profile, ipc);

    this.spawn(options);
  }

  spawn({ file, args, env, cwd }: IShellOptions): void {
    const defaultOptions: pty.IWindowsPtyForkOptions = {
      name: 'xterm-256color',
      cols: 80,
      rows: 30,
      useConpty: true,
      cwd: resolveCWD(cwd),
      env: Object.assign(process.env, env),
    };

    this.pty = pty.spawn(file, args, defaultOptions);

    this.pty.onData(data => this.exec(data));
  }

  write(data: string): void {
    this.pty.write(data);
  }

  resize({ cols, rows }: IViewport): void {
    this.pty.resize(cols, rows);
  }

  clear(): void {
    this.pty.clear();
  }

  kill(): void {
    try {
      process.kill(this.pty.pid);
    } catch (error) {
      console.log(error);
    }
  }
}

export default Shell;
