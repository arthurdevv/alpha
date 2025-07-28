import { app, BrowserWindow, Menu } from 'electron';
import { enable, initialize } from '@electron/remote/main';
import * as glasstron from 'glasstron';
import { getSettings } from 'app/settings';
import checkForUpdates from 'app/updater';
import invokeEvents from 'app/events';
import installCLI from 'cli/install';
import { getBounds, saveBounds } from './bounds';

let isSingleInstance: boolean = true;

function handleInitialization(): void {
  const { onSecondInstance } = getSettings();

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
  mainWindow = new glasstron.BrowserWindow({
    width: 1050,
    height: 560,
    minWidth: 400,
    minHeight: 300,
    frame: false,
    title: 'Alpha',
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    backgroundColor: '#00000000',
    blurType: 'acrylic',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    ...settings,
    ...getBounds(centerOnLaunch),
  });

  enable(mainWindow.webContents);

  mainWindow.loadURL(
    app.isPackaged ? `file://${__dirname}/index.html` : 'http://localhost:4000',
  );

  mainWindow.on('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();

      !app.isPackaged && mainWindow.webContents.openDevTools();
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

  if (acrylic) mainWindow.setBlur(acrylic);

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

const { autoUpdates, gpu, acrylic, launchMode, centerOnLaunch, ...settings } =
  getSettings();

if (!gpu) {
  app.disableHardwareAcceleration();
}

app.whenReady().then(() => {
  isSingleInstance && createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  if (app.isPackaged) installCLI();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.commandLine.appendSwitch('disable-features', 'WidgetLayering');

Menu.setApplicationMenu(null);

export { createWindow };
