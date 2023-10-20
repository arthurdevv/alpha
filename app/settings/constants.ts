import { join, dirname } from 'path';

const { app }: typeof Electron =
  process.type === 'browser'
    ? require('electron')
    : require('@electron/remote');

export const isWin = process.platform === 'win32';

export const appPath = app.isPackaged ? __dirname : app.getAppPath();

export const appDir = join(dirname(appPath), '../..');

export const userData = app.getPath(isWin ? 'userData' : 'home');

export const userPath = join(userData, '.alpha.yaml');

export const defaultPath = join(appPath, 'app/settings', 'schema.yaml');

export const userKeymapsPath = join(userData, 'keymaps.yaml');

export const keymapsPath = join(
  appPath,
  'app/keymaps/schema',
  `${process.platform}.yaml`,
);
