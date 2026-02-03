import { app, BrowserWindow, globalShortcut, Menu } from 'electron';
import { enable, initialize } from '@electron/remote/main';
import * as glasstron from 'glasstron';
import settings, { getSettings } from 'app/settings';
import { iconPath, isPackaged } from 'app/settings/constants';
import checkForUpdates from 'app/updater';
import initMainAnalytics from 'app/analytics';
import invokeEvents from 'app/events';
import installCLI from 'cli/install';
import { getBounds, saveBounds } from './bounds';

const { autoUpdates, enableAnalytics, acrylic, launchMode, centerOnLaunch } =
  settings;

if (isPackaged) initMainAnalytics(enableAnalytics);

let isSingleInstance: boolean = true;

function handleInitialization(): void {
  const { onSecondInstance } = settings;

  if (onSecondInstance === 'attach') {
    isSingleInstance = app.requestSingleInstanceLock();

    if (!isSingleInstance) {
      app.quit();
    } else {
      app.on('second-instance', async (event, _, cwd) => {
        event.preventDefault();

        if (mainWindow) {
          mainWindow.webContents.send('second-instance', { cwd });
        }
      });
    }
  }

  initialize();
}

let mainWindow: Alpha.BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new (acrylic ? glasstron.BrowserWindow : BrowserWindow)({
    width: 1050,
    height: 560,
    minWidth: 400,
    minHeight: 300,
    show: false,
    frame: false,
    title: 'Alpha',
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    ...settings,
    ...getBounds(centerOnLaunch),
  }) as Alpha.BrowserWindow;

  enable(mainWindow.webContents);

  if (!isPackaged) mainWindow.setIcon(iconPath);

  mainWindow.loadURL(
    isPackaged ? `file://${__dirname}/index.html` : 'http://localhost:4000',
  );

  mainWindow.on('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();

      if (!isPackaged) mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('close', () => {
    mainWindow && saveBounds(mainWindow.getBounds());
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('blur', () => {
    const { alwaysOnTop, autoHideOnBlur } = getSettings();

    if (mainWindow && !alwaysOnTop && !mainWindow.isFocused()) {
      mainWindow[autoHideOnBlur ? 'minimize' : 'blur']();
    }
  });

  if (acrylic) {
    mainWindow.blurType = 'acrylic';

    mainWindow.setBlur(acrylic);
  }

  if (autoUpdates) checkForUpdates(mainWindow);

  switch (launchMode) {
    case 'fullscreen':
      mainWindow.setFullScreen(true);
      break;

    case 'maximized':
      mainWindow.maximize();
      break;
  }

  invokeEvents(mainWindow);
}

handleInitialization();

app.commandLine.appendSwitch(
  'disable-features',
  'WidgetLayering,CalculateNativeWinOcclusion',
);

app.whenReady().then(() => {
  isSingleInstance && createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  if (isPackaged) installCLI();

  Menu.setApplicationMenu(null);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

export { createWindow };
