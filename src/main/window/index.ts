import path from 'node:path';

import { app, BrowserWindow, Menu } from 'electron';

// import * as glasstron from 'glasstron';

// import installCLI from 'cli/install';
import invokeEvents from 'main/ipc/events';
import { keymaps } from 'main/keymaps';
import { settings } from 'main/settings';
import { PATHS } from 'shared/config';

import { bounds } from './bounds';

// import { migrateSettings } from 'main/settings';
// import { getSettings } from 'main/settings';
// import initMainAnalytics from 'main/services/analytics';
// import checkForUpdates from 'main/services/updater';
// import { iconPath, isPackaged } from 'main/settings/constants';

// import { getBounds, saveBounds } from './bounds';

// if (isPackaged) initMainAnalytics(enableAnalytics);

const isSingleInstance: boolean = true;

// function handleInitialization(): void {
//   const { onSecondInstance } = settings;

//   if (onSecondInstance === 'attach') {
//     isSingleInstance = app.requestSingleInstanceLock();

//     if (!isSingleInstance) {
//       app.quit();
//     } else {
//       app.on('second-instance', async (event, _, cwd) => {
//         event.preventDefault();

//         if (mainWindow) {
//           // tava no ipc renderer
//           mainWindow.webContents.send('second-instance', { cwd });
//         }
//       });
//     }
//   }
// }

export function createWindow() {
  const { acrylic, alwaysOnTop, centerOnLaunch: center, launchMode } = settings.get();

  // const mainWindow = new (acrylic ? glasstron.BrowserWindow : BrowserWindow)({
  const mainWindow = new BrowserWindow({
    icon: path.join(PATHS.app, 'build/icon.ico'),
    minWidth: 400,
    minHeight: 300,
    show: false,
    frame: false,
    title: 'Alpha',
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true,
      contextIsolation: true,
      spellcheck: false,
    },
    center,
    alwaysOnTop: true,
    // alwaysOnTop,
    ...bounds.get(),
  });

  mainWindow.loadURL(app.isPackaged ? `file://${__dirname}/index.html` : 'http://localhost:4000');

  mainWindow.on('ready-to-show', () => {
    if (launchMode === 'fullscreen') {
      mainWindow.setFullScreen(true);
    } else if (launchMode === 'maximized') {
      mainWindow.maximize();
    }

    mainWindow.show();
  });

  mainWindow.on('blur', () => {
    const { alwaysOnTop, autoHideOnBlur } = settings.get();

    if (!alwaysOnTop && !mainWindow.isFocused()) {
      mainWindow[autoHideOnBlur ? 'minimize' : 'blur']();
    }
  });

  mainWindow.on('close', () => {
    bounds.save(mainWindow.getBounds());
  });

  // if (acrylic) {
  //   mainWindow.blurType = 'acrylic';
  //   mainWindow.setBlur(acrylic);
  // }

  // if (autoUpdates) checkForUpdates(mainWindow);

  invokeEvents(mainWindow);

  // REMOVER DEPOIS
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(async () => {
  await Promise.all([settings.init(), keymaps.init(), bounds.init()]);

  if (isSingleInstance) createWindow();
  // if (app.isPackaged) installCLI();

  Menu.setApplicationMenu(null);
});

app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');
