import { app, BrowserWindow, ipcMain } from 'electron';
import { initialize, enable } from '@electron/remote/main';
import { resolve } from 'path';
import { getSettings } from 'app/settings';
import installCLI from 'cli/install';
import checkForUpdates from './updater';

initialize();

const { gpu, autoUpdates } = getSettings();

let mainWindow: Electron.BrowserWindow | null;

const isDev = process.env.NODE_ENV === 'development';

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1050,
    height: 560,
    minWidth: 400,
    minHeight: 300,
    frame: false,
    title: 'Alpha',
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    webPreferences: {
      preload: resolve(__dirname, 'app/window', 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  enable(mainWindow.webContents);

  mainWindow.loadURL(
    isDev ? 'http://localhost:4000' : `file://${__dirname}/index.html`,
  );

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

  ipcMain.on('window:devtools', () => {
    if (mainWindow) {
      const { webContents } = mainWindow;

      if (webContents.isDevToolsOpened()) {
        webContents.closeDevTools();
      } else {
        webContents.openDevTools();
      }
    }
  });

  if (autoUpdates) checkForUpdates(mainWindow);
}

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

  installCLI();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.allowRendererProcessReuse = false;

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
