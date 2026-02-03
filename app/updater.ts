import { autoUpdater } from 'electron-updater';
import { dialog } from 'electron';
import { isPackaged } from 'app/settings/constants';

export function checkForUpdates(): void {
  if (!isPackaged) return;

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
}

export default (mainWindow: Alpha.BrowserWindow): void => {
  if (!isPackaged) return;

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

  mainWindow.webContents.on(
    'before-input-event',
    (event, { control, shift, key }) => {
      const isReloadKey = key.toLowerCase() === 'r';

      if ((control && isReloadKey) || (control && shift && isReloadKey)) {
        event.preventDefault();
      }
    },
  );
};
