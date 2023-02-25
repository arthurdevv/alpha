import { ipcMain, BrowserWindow } from 'electron';

export default () => {
  const focusedWindow = BrowserWindow.getFocusedWindow;

  ipcMain.on('window-reload', () => {
    focusedWindow()?.reload();
  });

  ipcMain.on('window-minimize', () => {
    focusedWindow()?.minimize();
  });

  ipcMain.on('window-maximize', () => {
    focusedWindow()?.maximize();
  });

  ipcMain.on('window-restore', () => {
    focusedWindow()?.restore();
  });

  ipcMain.on('window-close', () => {
    focusedWindow()?.close();
  });

  ipcMain.on('window-toggle-fullscreen', () => {
    const isFullScreen = focusedWindow()?.isFullScreen();

    focusedWindow()?.setFullScreen(!isFullScreen);
  });

  ipcMain.on('window-toggle-devtools', () => {
    const isDevToolsOpened = focusedWindow()?.webContents.isDevToolsOpened();

    if (isDevToolsOpened) {
      focusedWindow()?.webContents.closeDevTools();
    } else {
      focusedWindow()?.webContents.openDevTools();
    }
  });
};
