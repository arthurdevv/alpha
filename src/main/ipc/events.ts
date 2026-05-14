// import type { BrowserWindow } from 'glasstron';
// import { getWorkingDirectoryFromPID } from 'native-process-working-directory';
// import { checkForUpdates } from 'src/main/services/updater';
// import { createWindow } from 'src/main/window';
// import { reportError } from 'src/shared/error-reporter';

// import Serial from 'main/connections/serial';
// import SSH from 'main/connections/ssh';
// import { getDefaultProfile, getProfileByKey } from 'main/core/profiles';
// import Shell, { getExternalLaunch } from 'main/core/shell';
// import getGitInfo from 'main/services/git-info';
// import { getSettings } from 'main/settings';
// import type { InstanceArgs } from 'main/types';
// import { sanitizeObject } from 'main/utils/utils';
// import { bindKeymaps } from 'main/keymaps';

import { app } from 'electron';
import type { BrowserWindow } from 'glasstron';

import { listThemes, loadTheme } from 'main/core/themes';
import { keymaps } from 'main/keymaps';
import { defaultProfiles } from 'main/profiles/defaults';
import { loadTranslation } from 'main/services/i18n';
import { settings } from 'main/settings';
import { getSystemInfo } from 'main/utils/systemInfo';

import { IPCMain } from './main';

// const processes: Record<string, Shell | SSH | Serial> = {};

// function createInstance({
//   profile,
//   origin,
//   id,
//   title,
//   commands,
//   overrideTitle,
// }: InstanceArgs) {
//   const externalLaunch = getExternalLaunch();

//   profile = externalLaunch
//     ? getProfileByKey('type', 'shell')
//     : getDefaultProfile(profile);

//   const { type, name, options, title: useProfileName } = profile;

//   if (!overrideTitle) {
//     if (useProfileName) {
//       title = name;
//     } else {
//       title = type === 'shell' ? options.file : name;
//     }
//   }

//   const instance = <IInstance>{
//     profile,
//     id: id ?? crypto.randomUUID(),
//     isExpanded: false,
//     isConnected: false,
//     title,
//     hasCustomTitle: overrideTitle,
//   };

//   let process: Shell | Serial | SSH;

//   if (type === 'shell') {
//     const { options } = profile;

//     if (externalLaunch) options.cwd = externalLaunch;

//     if (origin) {
//       const { preserveCWD } = getSettings();

//       if (preserveCWD) {
//         const { pty } = <Shell>processes[origin];

//         try {
//           options.cwd = getWorkingDirectoryFromPID(pty.pid) ?? options.cwd;
//         } catch (error) {
//           reportError(error);
//         }
//       }
//     }

//     process = new Shell(options, instance, ipc);
//   } else {
//     const { options } = profile;

//     process = new (type === 'ssh' ? SSH : Serial)(options, instance, ipc);

//     setTimeout(() => (process as SSH | Serial).connect(), 100);
//   }

//   if (commands) commands.forEach(command => process.write(`${command}\r`));

//   processes[instance.id] = process;

//   return instance;
// }

export default (mainWindow: BrowserWindow) => {
  const ipc = new IPCMain(mainWindow);

  ///////////////////////////
  //          APP
  ///////////////////////////

  ipc.on('app:version', () => app.getVersion());
  ipc.on('app:is-packaged', () => app.isPackaged);

  ///////////////////////////
  //        SETTINGS
  ///////////////////////////

  ipc.handle('settings:load', defaults => settings.load(defaults));
  ipc.handle('settings:get', () => settings.get());
  ipc.handle('settings:pick', key => settings.pick(key));
  ipc.on('settings:save', (value, flat) => settings.save(value, flat));
  ipc.on('settings:reset', (scope, key) => settings.reset(scope, key));
  settings.subscribe(settings => ipc.send('settings:changed', settings));

  ///////////////////////////
  //        KEYMAPS
  ///////////////////////////

  ipc.handle('keymaps:load', () => keymaps.load());
  ipc.on('keymaps:save', value => keymaps.save(value));
  ipc.on('keymaps:reset', command => keymaps.reset(command));

  ///////////////////////////
  //       PROFILES
  ///////////////////////////

  ipc.handle('profiles:defaults', async connections => await defaultProfiles(connections));

  ///////////////////////////
  //         THEME
  ///////////////////////////

  ipc.handle('theme:load', name => loadTheme(name));
  ipc.handle('theme:list', () => listThemes());

  ///////////////////////////
  //        WINDOW
  ///////////////////////////

  ipc.on('window:action', (action, ...args) => {
    mainWindow[action](...args);
  });

  ['maximize', 'unmaximize', 'restore', 'minimize'].forEach(event => {
    mainWindow.on(event as any, () => {
      ipc.send('window:state-changed', mainWindow.isMaximized());
    });
  });

  ///////////////////////////
  //          SYSTEM
  ///////////////////////////

  ipc.handle('system:info', () => getSystemInfo());

  ///////////////////////////
  //          i18n
  ///////////////////////////

  ipc.handle('i18n:get-preferred-system-languages', () => app.getPreferredSystemLanguages());

  ipc.handle('i18n:load-translation', async lng => {
    try {
      return await loadTranslation(lng);
    } catch (error) {
      reportError(error);
    }

    return {};
  });

  //   ipc.on('terminal:create', (args: InstanceArgs) => {
  //     const instance = createInstance(args ?? {});

  //     if (args && args.id) return instance;

  //     ipc.send('terminal:request', { instance });
  //   });

  //   ipc.on('terminal:prepare-history', ({ id, buffer }) => {
  //     const process = processes[id];

  //     if (process instanceof Shell) {
  //       process.setTimestamp({
  //         buffer,
  //         executedAt: new Date().toJSON(),
  //         entryTime: performance.now(),
  //       });
  //     }
  //   });

  //   ipc.on('terminal:get-git-info', async ({ id }) => {
  //     const process = processes[id];

  //     if (process instanceof Shell) {
  //       let info: IGitInfo | null = null;

  //       try {
  //         const cwd = getWorkingDirectoryFromPID(process.pty.pid);

  //         if (cwd) info = await getGitInfo(cwd);
  //       } catch (error) {
  //         reportError(error);
  //       }

  //       ipc.send('terminal:git-info', { id, info });
  //     }
  //   });

  //   ipc.on('pane:create', ({ id, profile, orientation }) => {
  //     const instance = createInstance({ profile, origin: id });

  //     ipc.send('pane:request', { id, instance, orientation });
  //   });

  //   ipc.on('process:write', ({ id, data }) => {
  //     const process = processes[id];

  //     if (process) process.write(data);
  //   });

  //   ipc.on('process:resize', ({ id, cols, rows }) => {
  //     const process = processes[id];

  //     if (process && process instanceof Shell) process.resize({ cols, rows });
  //   });

  //   ipc.on('process:action', ({ id, action }) => {
  //     const process = processes[id];

  //     if (process) {
  //       if (action === 'kill') {
  //         delete processes[id];

  //         if (!(process instanceof Shell)) return process.disconnect();
  //       }

  //       action in process && process[action]();
  //     }
  //   });

  //   ipc.on('window:create', createWindow);

  //   ipc.on('window:title', title => {
  //     mainWindow.setTitle(title);
  //   });

  //   ipc.on('window:opacity', opacity => {
  //     mainWindow.setOpacity(opacity);
  //   });

  //   ipc.on('window:alwaysOnTop', flag => {
  //     mainWindow.setAlwaysOnTop(flag);
  //   });

  //   ipc.on('window:devtools', () => {
  //     mainWindow.webContents.toggleDevTools();
  //   });

  //   ipc.on('window:fullscreen', () => {
  //     mainWindow.setFullScreen(!mainWindow.fullScreen);
  //   });

  //   ipc.on('app:check-for-updates', checkForUpdates);

  //   ipc.on('app:run-workspace', ({ tabs }: IWorkspace) => {
  //     tabs.forEach(({ profile: id, ...tab }) => {
  //       const profile = getProfileByKey('id', id);

  //       ipc.emit('terminal:create', { ...tab, profile });
  //     });
  //   });

  //   ipc.on('app:restore-session', ({ snapshot }: ISession) => {
  //     snapshot.forEach(args => {
  //       try {
  //         createInstance(args);
  //       } catch (error) {
  //         reportError(error);
  //       }
  //     });
  //   });

  //   mainWindow.on('close', () => {
  //     const snapshot = Object.entries(processes).map<ISnapshot>(
  //       ([id, process]) => {
  //         const { type, options } = process.profile;

  //         if (type === 'shell') {
  //           const { pty } = process as Shell;

  //           try {
  //             options.cwd = getWorkingDirectoryFromPID(pty.pid) ?? options.cwd;
  //           } catch (error) {
  //             reportError(error);
  //           }
  //         }

  //         if (process instanceof Shell) process.kill();
  //         else process.disconnect();

  //         delete processes[id];

  //         return { id, profile: process.profile };
  //       },
  //     );

  //     ipc.send('app:update-session', { snapshot: sanitizeObject(snapshot) });
  //   });
};
