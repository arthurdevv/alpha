import { v4 as uuidv4 } from 'uuid';
import { getWorkingDirectoryFromPID } from 'native-process-working-directory';
import { createWindow } from 'app/window';
import { getSettings } from 'app/settings';
import { checkForUpdates } from 'app/updater';
import { getDefaultProfile, getProfileByKey } from 'app/common/profiles';
import Shell, { getExternalLaunch } from 'app/common/shell';
import SSH from 'app/connections/ssh';
import Serial from 'app/connections/serial';
import IPC from 'shared/ipc/main';
import { reportError } from 'shared/error-reporter';
import { sanitizeObject } from 'lib/utils';

let ipc: IPC;

const processes: Record<string, Shell | SSH | Serial> = {};

function createInstance({
  profile,
  origin,
  id,
  title,
  commands,
  overrideTitle,
}: InstanceArgs) {
  const externalLaunch = getExternalLaunch();

  profile = externalLaunch
    ? getProfileByKey('type', 'shell')
    : getDefaultProfile(profile);

  const { type, name, options, title: useProfileName } = profile;

  if (!overrideTitle) {
    if (useProfileName) {
      title = name;
    } else {
      title = type === 'shell' ? options.file : name;
    }
  }

  const instance = <IInstance>{
    profile,
    id: id ?? uuidv4(),
    isExpanded: false,
    isConnected: false,
    title,
    hasCustomTitle: overrideTitle,
  };

  let process: Shell | Serial | SSH;

  if (type === 'shell') {
    const { options } = profile;

    if (externalLaunch) options.cwd = externalLaunch;

    if (origin) {
      const { preserveCWD } = getSettings();

      if (preserveCWD) {
        const { pty } = <Shell>processes[origin];

        try {
          options.cwd = getWorkingDirectoryFromPID(pty.pid) ?? options.cwd;
        } catch (error) {
          reportError(error);
        }
      }
    }

    process = new Shell(options, instance, ipc);
  } else {
    const { options } = profile;

    process = new (type === 'ssh' ? SSH : Serial)(options, instance, ipc);

    setTimeout(() => (process as SSH | Serial).connect(), 100);
  }

  if (commands) commands.forEach(command => process.write(`${command}\r`));

  processes[instance.id] = process;

  return instance;
}

export default (mainWindow: Alpha.BrowserWindow) => {
  ipc = new IPC(mainWindow);

  ipc.on('terminal:create', (args: InstanceArgs) => {
    const instance = createInstance(args ?? {});

    if (args && args.id) return instance;

    ipc.send('terminal:request', { instance });
  });

  ipc.on('terminal:prepare-history', ({ id, buffer }) => {
    const process = processes[id];

    if (process instanceof Shell) {
      process.setTimestamp({
        buffer,
        executedAt: new Date().toJSON(),
        entryTime: performance.now(),
      });
    }
  });

  ipc.on('pane:create', ({ id, profile, orientation }) => {
    const instance = createInstance({ profile, origin: id });

    ipc.send('pane:request', { id, instance, orientation });
  });

  ipc.on('process:write', ({ id, data }) => {
    const process = processes[id];

    if (process) process.write(data);
  });

  ipc.on('process:resize', ({ id, cols, rows }) => {
    const process = processes[id];

    if (process && process instanceof Shell) process.resize({ cols, rows });
  });

  ipc.on('process:action', ({ id, action }) => {
    const process = processes[id];

    if (process) {
      if (action === 'kill') {
        delete processes[id];

        if (!(process instanceof Shell)) return process.disconnect();
      }

      action in process && process[action]();
    }
  });

  ipc.on('window:create', createWindow);

  ipc.on('window:title', title => {
    mainWindow.setTitle(title);
  });

  ipc.on('window:opacity', opacity => {
    mainWindow.setOpacity(opacity);
  });

  ipc.on('window:alwaysOnTop', flag => {
    mainWindow.setAlwaysOnTop(flag);
  });

  ipc.on('window:devtools', () => {
    mainWindow.webContents.toggleDevTools();
  });

  ipc.on('window:fullscreen', () => {
    mainWindow.setFullScreen(!mainWindow.fullScreen);
  });

  ipc.on('app:check-for-updates', checkForUpdates);

  ipc.on('app:run-workspace', ({ tabs }: IWorkspace) => {
    tabs.forEach(({ profile: id, ...tab }) => {
      const profile = getProfileByKey('id', id);

      ipc.emit('terminal:create', { ...tab, profile });
    });
  });

  ipc.on('app:restore-session', ({ snapshot }: ISession) => {
    snapshot.forEach(args => {
      try {
        createInstance(args);
      } catch (error) {
        reportError(error);
      }
    });
  });

  mainWindow.on('close', () => {
    const snapshot = Object.entries(processes).map<ISnapshot>(
      ([id, process]) => {
        const { type, options } = process.profile;

        if (type === 'shell') {
          const { pty } = process as Shell;

          try {
            options.cwd = getWorkingDirectoryFromPID(pty.pid) ?? options.cwd;
          } catch (error) {
            reportError(error);
          }
        }

        if (process instanceof Shell) process.kill();
        else process.disconnect();

        delete processes[id];

        return { id, profile: process.profile };
      },
    );

    ipc.send('app:update-session', { snapshot: sanitizeObject(snapshot) });
  });
};
