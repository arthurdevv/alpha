import { join, dirname } from 'path';

const { app }: typeof Electron =
  process.type === 'browser'
    ? require('electron')
    : require('@electron/remote');

export const appPath = app.isPackaged ? __dirname : app.getAppPath();

export const appDir = join(dirname(appPath), '../..');

export const appExec = dirname(app.getPath('exe'));

export const userData = app.getPath('userData');

export const userPath = join(userData, '.alpha.yaml');

export const defaultPath = join(appPath, 'app/settings', 'default.yaml');

export const userKeymapsPath = join(userData, 'keymaps.yaml');

export const keymapsPath = join(appPath, 'app/keymaps', 'default.yaml');

export const boundsPath = join(userData, 'bounds.yaml');
