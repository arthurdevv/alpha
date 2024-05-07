import { resolve } from 'path';
import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import { enable, initialize } from '@electron/remote/main';
import { applyEffect, setup as setupEffect } from '@pyke/vibe';
import installCLI from 'cli/install';
import { getSettings } from 'app/settings';
import { getBounds } from './bounds';
import checkForUpdates from './updater';

initialize();

let mainWindow: Electron.BrowserWindow | null;

const { gpu, autoUpdates, acrylic } = getSettings();

function createWindow(): void {
  const bounds = getBounds();

  mainWindow = new BrowserWindow({
    width: 1050,
    height: 560,
    minWidth: 400,
    minHeight: 300,
    frame: false,
    title: 'Alpha',
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: resolve(__dirname, 'app/window', 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
    ...bounds,
  });

  enable(mainWindow.webContents);

  mainWindow.loadURL(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000'
      : `file://${__dirname}/index.html`,
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

  mainWindow.on('blur', () => {
    if (mainWindow) {
      const { autoHideOnBlur } = getSettings();

      const unfocused = !mainWindow.isFocused();

      if (unfocused) {
        mainWindow[autoHideOnBlur ? 'minimize' : 'blur']();
      }
    }
  });

  ipcMain.on('window:create', createWindow);

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

  ipcMain.on('window:set-title', (_, title) => {
    if (mainWindow) {
      mainWindow.setTitle(title);
    }
  });

  ipcMain.on('window:opacity', () => {
    if (mainWindow) {
      const { opacity } = getSettings();

      mainWindow.setOpacity(opacity);
    }
  });

  ipcMain.on('window:always-on-top', () => {
    if (mainWindow) {
      const { alwaysOnTop } = getSettings();

      mainWindow.setAlwaysOnTop(alwaysOnTop);
    }
  });

  if (autoUpdates) checkForUpdates(mainWindow);

  if (acrylic) {
    setupEffect(app);

    applyEffect(mainWindow, 'unified-acrylic');
  }
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

  installCLI();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.allowRendererProcessReuse = false;

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
