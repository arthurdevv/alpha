import { join } from 'path';

const { app }: typeof Electron =
  process.type === 'browser'
    ? require('electron')
    : require('@electron/remote');

export const userData =
  process.platform === 'win32' ? app.getPath('userData') : app.getPath('home');

export const appPath = app.isPackaged ? __dirname : app.getAppPath();

export const userPath = join(userData, '.alpha.yaml');

export const defaultPath = join(appPath, 'app/settings', 'default.yaml');

export const keymapsPath = join(
  appPath,
  'app/keymaps/default',
  `${process.platform}.yaml`,
);
