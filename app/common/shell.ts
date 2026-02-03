import * as pty from 'node-pty';
import { existsSync } from 'fs';
import { isAbsolute, normalize } from 'path';
import { getWorkingDirectoryFromPID } from 'native-process-working-directory';
import { HOMEDIR } from 'app/settings/constants';
import Logger from 'app/common/logger';
import Performance from 'app/utils/performance';
import { reportError } from 'shared/error-reporter';

export function getExternalLaunch(): string | null {
  const workingDirectory = process.argv[1];

  if (!workingDirectory || workingDirectory.startsWith('-')) return null;

  process.argv.splice(1, 1);

  return workingDirectory;
}

function resolveCWD(path: string | null | undefined): string {
  if (path && isAbsolute(path) && existsSync(path)) return normalize(path);

  return HOMEDIR;
}

class Shell extends Logger {
  pty!: pty.IPty;

  private options: IShellOptions;

  private timestamp: any = {};

  constructor(options: IShellOptions, { id, profile }: IInstance, ipc: IPC) {
    super(id, profile, ipc);

    this.options = options;

    this.spawn(options);
  }

  spawn({ file, args, env: _env, cwd }: IShellOptions): void {
    const env = Object.fromEntries(
      Object.entries(_env).map(([key, { value }]) => [key, value]),
    );

    const defaultOptions: pty.IWindowsPtyForkOptions = {
      name: 'xterm-256color',
      cols: 80,
      rows: 30,
      useConpty: true,
      cwd: resolveCWD(cwd),
      env: Object.assign(process.env, env),
    };

    this.pty = pty.spawn(file, args, defaultOptions);

    const watcher = new Performance(300, () => {
      this.timestamp.executionTime = watcher.get();

      if (this.timestamp.entryTime) {
        this.exec(this.timestamp, 'save-history');

        this.timestamp = {};
      }
    });

    this.pty.onData(data => {
      this.exec(data);

      watcher.set(performance.now());
    });
  }

  write(command: string) {
    this.pty.write(command);
  }

  resize({ cols, rows }: IViewport): void {
    this.pty.resize(cols, rows);
  }

  clear(): void {
    this.pty.clear();
  }

  setTimestamp(timestamp: any) {
    let where: string | null = this.options.cwd;

    try {
      where = getWorkingDirectoryFromPID(this.pty.pid);
    } catch (error) {
      reportError(error);
    }

    this.timestamp = {
      ...timestamp,
      id: this.profile.id,
      where: resolveCWD(where),
    };
  }

  kill(): void {
    try {
      process.kill(this.pty.pid);
    } catch (error) {
      reportError(error);
    }
  }
}

export default Shell;
