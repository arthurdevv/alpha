import { v4 as uuidv4 } from 'uuid';
import { getWorkingDirectoryFromPID } from 'native-process-working-directory';
import { checkForUpdates } from 'app/updater';
import { createWindow } from 'app/window';
import { getSettings } from 'app/settings';
import { getDefaultProfile } from 'app/common/profiles';
import Process, { processes } from 'app/common/process';
import listeners from 'app/settings/listeners';
import IPC from 'shared/main';

let ipc: IPC;

function createProcess({ id, source, options, profile }: CreateProcessOptions) {
  profile = getDefaultProfile(profile);

  options = options || profile.options;

  if (id && !source) {
    const { preserveCWD } = getSettings();

    if (preserveCWD) {
      const { process } = processes[id];

      options.cwd = getWorkingDirectoryFromPID(process.pid);
    }
  }

  const process = <IProcess>{
    id: source ?? uuidv4(),
    isExpanded: false,
    profile,
  };

  const pty = new Process(ipc, process.id, profile, options);

  processes[process.id] = pty;

  return process;
}

export default (mainWindow: Alpha.BrowserWindow) => {
  ipc = new IPC(mainWindow);

  ipc.on('terminal:create', profile => {
    const process = createProcess({ profile });

    ipc.send('terminal:request', { process });
  });

  ipc.on('pane:create', ({ id, profile, orientation }) => {
    const { options } = profile || processes[id];

    const process = createProcess({ id, options, profile });

    ipc.send('pane:request', { id, process, orientation });
  });

  ipc.on('process:write', ({ id, data }) => {
    const process = processes[id];

    if (process) process.write(data);
  });

  ipc.on('process:resize', ({ id, cols, rows }) => {
    const process = processes[id];

    if (process) process.resize({ cols, rows });
  });

  ipc.on('process:clear', ({ id }) => {
    const process = processes[id];

    if (process) process.clear();
  });

  ipc.on('process:kill', ({ id }) => {
    const process = processes[id];

    if (process) process.kill();
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

  ipc.on('app:check-for-updates', checkForUpdates);

  ipc.on('app:save-session', () => {
    const instances = Object.keys(processes).map(id => {
      const { process, options, profile } = processes[id];

      options.cwd = getWorkingDirectoryFromPID(process.pid) ?? options.cwd;

      return { id, options, profile };
    }) as IInstance[];

    ipc.send('app:update-session', { instances });
  });

  ipc.on('app:restore-session', ({ instances }) => {
    instances.forEach((instance: IInstance) => {
      try {
        const { id, options, profile } = instance;

        createProcess({ source: id, options, profile });
      } catch (error) {
        console.error(error);
      }
    });
  });

  ipc.on('ipc-main-ready', () => {
    setTimeout(() => ipc.send('ipc-renderer-ready'), 3900);
  });

  listeners.subscribe('options', () => {
    const settings = getSettings();

    ['opacity', 'alwaysOnTop'].forEach(option => {
      ipc.emit(`window:${option}`, settings[option]);
    });
  });
};
