import { arch, homedir, release } from 'os';
import { dirname, join } from 'path';
import { versions } from 'process';

const { app }: typeof Electron =
  process.type === 'browser'
    ? require('electron')
    : require('@electron/remote');

export const appPath = app.isPackaged ? __dirname : app.getAppPath();

export const appDir = join(dirname(appPath), '../..');

export const appExec = dirname(app.getPath('exe'));

export const userData = app.getPath('userData');

export const settingsPath = join(appPath, 'app/settings', 'default.yaml');

export const userSettingsPath = join(userData, '.alpha.yaml');

export const keymapsPath = join(appPath, 'app/keymaps', 'default.yaml');

export const userKeymapsPath = join(userData, 'keymaps.yaml');

export const boundsPath = join(userData, 'bounds.yaml');

export const debugVersions = (() => {
  const setup = app.getAppPath().includes(homedir()) ? 'user' : 'system';

  return {
    Version: `${app.getVersion()} (${setup} setup)`,
    Electron: versions.electron,
    'Node.js': versions.node,
    Chromium: versions.chrome,
    V8: versions.v8,
    OS: `Windows NT ${release()} ${arch()}`,
  };
})();
