import { v4 as uuidv4 } from 'uuid';
import { delay } from 'lodash';
import { getWorkingDirectoryFromPID } from 'native-process-working-directory';
import { createWindow } from 'app/window';
import { getSettings } from 'app/settings';
import { checkForUpdates } from 'app/updater';
import { getDefaultProfile } from 'app/common/profiles';
import Shell from 'app/common/shell';
import SSH from 'app/connections/ssh';
import Serial from 'app/connections/serial';
import IPC from 'shared/main';
import { sanitizeObject } from 'lib/utils';

let ipc: IPC;

const processes: Record<string, Shell | SSH | Serial> = {};

function createInstance({ profile, origin, id }: InstanceAttrs) {
  profile = getDefaultProfile(profile);

  const { type, name, options } = profile;

  const instance = <IInstance>{
    profile,
    id: id ?? uuidv4(),
    isExpanded: false,
    isConnected: false,
    title: type === 'shell' ? options.file : name,
  };

  let process: Shell | Serial | SSH;

  if (type === 'shell') {
    const { options } = profile;

    if (origin) {
      const { preserveCWD } = getSettings();

      if (preserveCWD) {
        const { pty } = <Shell>processes[origin];

        options.cwd = getWorkingDirectoryFromPID(pty.pid);
      }
    }

    process = new Shell(options, instance, ipc);
  } else {
    const { options } = profile;

    process = new (type === 'ssh' ? SSH : Serial)(options, instance, ipc);

    delay(func => func.connect(), 100, process);
  }

  processes[instance.id] = process;

  return instance;
}

export default (mainWindow: Alpha.BrowserWindow) => {
  ipc = new IPC(mainWindow);

  ipc.on('terminal:create', (profile: IProfile) => {
    const instance = createInstance({ profile });

    ipc.send('terminal:request', { instance });
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

  ipc.on('app:save-session', () => {
    const snapshot = Object.entries(processes).map<ISnapshot>(
      ([id, process]) => {
        const { type, options } = process.profile;

        if (process instanceof Shell && type === 'shell') {
          const { pty } = process;

          options.cwd = getWorkingDirectoryFromPID(pty.pid) ?? options.cwd;
        }

        return { id, profile: process.profile };
      },
    );

    ipc.send('app:update-session', { snapshot: sanitizeObject(snapshot) });
  });

  ipc.on('app:restore-session', ({ snapshot }: ISession) => {
    snapshot.forEach(attrs => {
      try {
        createInstance(attrs);
      } catch (error) {
        console.error(error);
      }
    });
  });

  ipc.on('app:check-for-updates', checkForUpdates);
};
