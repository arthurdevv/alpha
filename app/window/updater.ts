import { autoUpdater } from 'electron-updater';
import { dialog, ipcMain } from 'electron';

export default (mainWindow: Electron.BrowserWindow) => {
  autoUpdater.checkForUpdates();

  autoUpdater.once('update-downloaded', event => {
    const { releaseName } = event;

    const options: Electron.MessageBoxOptions = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      message: String(releaseName),
      detail:
        'A new update has been downloaded. Restart Alpha to apply the latest update.',
    };

    dialog.showMessageBox(options).then(({ response }) => {
      if (response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  mainWindow.on('close', () => {
    autoUpdater.removeAllListeners();
  });
};

ipcMain.on('app:check-for-updates', () => {
  autoUpdater.checkForUpdates();

  autoUpdater.once('update-not-available', () => {
    const options: Electron.MessageBoxOptions = {
      type: 'info',
      detail: 'There are currently no updates available.',
      message: String(),
    };

    dialog.showMessageBox(options).then(() => {
      autoUpdater.removeAllListeners();
    });
  });
});
