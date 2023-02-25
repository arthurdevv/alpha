import { app, BrowserWindow } from 'electron';
import { initialize, enable } from '@electron/remote/main';
import { is, electronApp, optimizer } from '@electron-toolkit/utils';
import { resolve } from 'path';
import invokeEvents from './events';
import checkForUpdates from './updater';

initialize();

let mainWindow: Electron.BrowserWindow | null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1050,
    height: 560,
    minWidth: 400,
    minHeight: 300,
    show: false,
    frame: false,
    title: 'Alpha',
    titleBarStyle: 'hidden',
    transparent: process.platform === 'darwin',
    autoHideMenuBar: true,
    webPreferences: {
      preload: resolve(__dirname, 'app/window', 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  enable(mainWindow.webContents);

  mainWindow.loadURL(
    is.dev ? 'http://localhost:4000' : `file://${__dirname}/index.html`,
  );

  if (is.dev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    if (mainWindow) {
      mainWindow.destroy();
    }

    mainWindow = null;
  });

  invokeEvents();
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('alpha.app');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  if (mainWindow && !is.dev) {
    checkForUpdates(mainWindow);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.allowRendererProcessReuse = false;
