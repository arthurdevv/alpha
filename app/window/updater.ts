import { app, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';

export default (mainWindow: Electron.BrowserWindow) => {
  if (app.isPackaged) {
    setInterval(() => {
      if (navigator.onLine) autoUpdater.checkForUpdates();
    }, 60000);

    autoUpdater.on('update-downloaded', event => {
      const { releaseName, releaseNotes } = event;

      const options: Electron.MessageBoxOptions = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Update Downloaded',
        message: String(global.isWin ? releaseNotes : releaseName),
        detail:
          'A new update has been downloaded. Restart Alpha to apply the updates.',
      };

      dialog.showMessageBox(options).then(returnValue => {
        if (returnValue.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    });

    autoUpdater.on('error', message => {
      const options: Electron.MessageBoxOptions = {
        type: 'error',
        buttons: ['Ok'],
        title: message.name,
        message: '',
        detail: 'There was a problem updating the application.',
      };

      dialog.showMessageBox(options);
    });

    mainWindow.on('close', () => {
      autoUpdater.removeAllListeners();
    });
  }
};
