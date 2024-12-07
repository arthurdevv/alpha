import { autoUpdater } from 'electron-updater';
import { dialog } from 'electron';

const shouldCheckForUpdates = !process.env.ALPHA_CLI;

export const checkForUpdates = () => {
  if (!shouldCheckForUpdates) return;

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
};

export default (mainWindow: Alpha.BrowserWindow) => {
  if (!shouldCheckForUpdates) return;

  autoUpdater.checkForUpdates();

  autoUpdater.on('update-downloaded', event => {
    const { releaseName } = event;

    const options: Electron.MessageBoxOptions = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      message: String(releaseName),
      detail:
        'A new update has been downloaded. Restart Alpha to apply the latest update.',
    };

    dialog.showMessageBox(options).then(({ response }) => {
      if (response === 0) autoUpdater.quitAndInstall();
    });
  });

  mainWindow.on('close', () => {
    autoUpdater.removeAllListeners();
  });
};
