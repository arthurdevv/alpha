import { join, dirname } from 'path';
import { existsSync } from 'fs';
import { app } from '@electron/remote';
import { appPath } from 'app/settings/constants';
import getRegistryPath from 'app/utils/registry-path';

const profiles: IProfile[] = [
  {
    title: 'Command Prompt',
    shell: join('C:\\Windows', 'system32', 'cmd.exe'),
    args: [],
  },
  {
    title: 'Clink',
    shell: join('C:\\Windows', 'system32', 'cmd.exe'),
    args: [
      '/k',
      app.isPackaged
        ? join(
            dirname(app.getPath('exe')),
            'resources',
            'clink',
            `clink_${process.arch}.exe`,
          )
        : join(appPath, 'app\\utils\\clink', `clink_${process.arch}.exe`),
      'inject',
    ],
  },
  {
    title: 'Cygwin',
    shell: join(getRegistryPath('Cygwin\\setup', 'rootdir'), 'bin', 'bash.exe'),
    args: ['--login', '-i'],
  },
  {
    title: 'Git Bash',
    shell: join(
      getRegistryPath('GitForWindows', 'InstallPath'),
      'bin',
      'bash.exe',
    ),
    args: ['--login', '-i'],
  },
  {
    title: `MSYS2`,
    shell: join('C:\\Windows', '..', 'msys64', 'msys2_shell.cmd'),
    args: ['-defterm', '-here', '-no-start'],
  },
  {
    title: 'PowerShell',
    shell: join(
      'C:\\Windows',
      'system32\\WindowsPowerShell\\v1.0',
      'powershell.exe',
    ),
    args: [],
  },
  {
    title: 'WSL',
    shell: join('C:\\Windows', 'system32', 'wsl.exe'),
    args: [],
  },
].filter(profile => existsSync(profile.shell));

export const getShellArgs = (shell: string): string[] =>
  profiles.filter(
    profile =>
      profile[Object.keys(profile).find(key => profile[key].includes(shell))!],
  )[0].args;

export default profiles;
