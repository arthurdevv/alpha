import { app } from '@electron/remote';
import { join } from 'path';

export const userData = global.isWin
  ? app.getPath('userData')
  : app.getPath('home');

export const appPath = app.isPackaged ? __dirname : app.getAppPath();

export const userPath = join(userData, '.alpha.js');

export const defaultPath = join(appPath, 'app/settings', 'default.js');
