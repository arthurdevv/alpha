import { arch, homedir, release } from 'os';
import { dirname, join } from 'path';
import { versions } from 'process';
import { existsSync } from 'fs';

const { app }: typeof Electron =
  process.type === 'browser'
    ? require('electron')
    : require('@electron/remote');

export const { isPackaged } = app;

export const appVersion = app.getVersion();

export const appPath = isPackaged ? __dirname : app.getAppPath();

export const appDir = join(dirname(appPath), '../..');

export const appExec = dirname(app.getPath('exe'));

export const userData = app.getPath('userData');

export const resourcesPath = join(isPackaged ? appExec : appPath, 'resources');

export const binPath = join(resourcesPath, 'bin');

export const iconPath = join(appPath, 'build', 'icon.ico');

export const settingsPath = join(appPath, 'app/settings', 'default.yaml');

export const userSettingsPath = join(userData, '.alpha.yaml');

export const keymapsPath = join(appPath, 'app/keymaps', 'default.yaml');

export const userKeymapsPath = join(userData, 'keymaps.yaml');

export const boundsPath = join(userData, 'bounds.yaml');

export const firstRunFlagPath = join(userData, 'first-run.flag');

export const firstRunFlag = existsSync(firstRunFlagPath);

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

export const HOMEDIR = process.env.USERPROFILE || homedir();

export const SENTRY_CONFIG: IAnalyticsConfig = {
  dsn: 'https://c737a602ad574456ba2313b229e1e80b@app.glitchtip.com/19339',
  tracesSampleRate: 0,
};
