import * as Registry from 'native-reg';
import { join, resolve, dirname } from 'path';
import { existsSync } from 'fs';
import { app } from '@electron/remote';
import { appPath } from 'app/settings/constants';

const getRegistryPath = (subKey: string, valueName: string): string => {
  const shellExtsKeys =
    Registry.openKey(Registry.HKLM, 'Software', Registry.Access.READ) ||
    Registry.openKey(Registry.HKCU, 'Software', Registry.Access.READ);

  const keyValue = shellExtsKeys
    ? Registry.getValue(shellExtsKeys, subKey, valueName)
    : null;

  Registry.closeKey(shellExtsKeys);

  return String(keyValue);
};

export const powerShellPath = (() => {
  const defaultPaths = [
    `${process.env.USERPROFILE}\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe`,
    `${process.env.SYSTEMROOT}\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`,
  ];

  for (let i = 0; i <= defaultPaths.length; i += 1) {
    if (existsSync(defaultPaths[i])) return defaultPaths[i];
  }

  return join(
    process.env.SYSTEMROOT || 'C:\\Windows',
    'system32',
    'powershell.exe',
  );
})();

export const clinkPath = app.isPackaged
  ? join(
      dirname(app.getPath('exe')),
      'resources',
      'clink',
      `clink_${process.arch}.exe`,
    )
  : join(appPath, 'app/common/profiles/clink', `clink_${process.arch}.exe`);

export const cmdPath =
  process.env.COMSPEC ||
  join(process.env.WINDIR || 'C:\\Windows', 'system32', 'cmd.exe');

export const msys2Path = join(
  resolve(process.env.SYSTEMROOT || 'C:\\Windows', '../msys64'),
  'msys2_shell.cmd',
);

export const gitBashPath = join(
  getRegistryPath('GitForWindows', 'InstallPath'),
  'bin',
  'bash.exe',
);

export const cygwinPath = join(
  getRegistryPath('Cygwin\\setup', 'rootdir'),
  'bin',
  'bash.exe',
);

export const wslPath = join(
  process.env.WINDIR || 'C:\\Windows',
  'system32',
  'wsl.exe',
);
