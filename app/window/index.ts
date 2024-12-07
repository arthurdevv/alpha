import { app, BrowserWindow, Menu } from 'electron';
import { enable, initialize } from '@electron/remote/main';
import * as glasstron from 'glasstron';
import { getSettings } from 'app/settings';
import checkForUpdates from 'app/updater';
import invokeEvents from 'app/events';
import installCLI from 'cli/install';
import { getBounds, saveBounds } from './bounds';

initialize();

const { gpu, autoUpdates, acrylic } = getSettings();

export function createWindow(): void {
  const mainWindow = new glasstron.BrowserWindow({
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
    ...getBounds(),
  });

  enable(mainWindow.webContents);

  mainWindow.loadURL(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000'
      : `file://${__dirname}/index.html`,
  );

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', () => {
    saveBounds(mainWindow.getBounds());

    mainWindow.close();
  });

  mainWindow.on('blur', () => {
    const { alwaysOnTop, autoHideOnBlur } = getSettings();

    if (!alwaysOnTop && !mainWindow.isFocused()) {
      mainWindow[autoHideOnBlur ? 'minimize' : 'blur']();
    }
  });

  if (acrylic) mainWindow.setBlur(acrylic);

  if (autoUpdates) checkForUpdates(mainWindow);

  invokeEvents(mainWindow);
}

Menu.setApplicationMenu(null);

if (!gpu) {
  app.disableHardwareAcceleration();
}

app.whenReady().then(() => {
  createWindow();

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
