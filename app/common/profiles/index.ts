import { existsSync } from 'fs';
import defaultShell from 'app/utils/default-shell';
import {
  cmdPath,
  clinkPath,
  powerShellPath,
  gitBashPath,
  wslPath,
  cygwinPath,
  msys2Path,
} from './constants';

const posixProfiles: IProfile[] = [
  {
    title: 'Default Shell',
    shell: defaultShell,
    args: ['--login'],
  },
];

const windowsProfiles: IProfile[] = [
  {
    title: 'Clink',
    shell: cmdPath,
    args: ['/k', clinkPath, 'inject'],
  },
  {
    title: 'Command Prompt',
    shell: cmdPath,
    args: [],
  },
  {
    title: 'Cygwin',
    shell: cygwinPath,
    args: ['--login', '-i'],
  },
  {
    title: 'Git Bash',
    shell: gitBashPath,
    args: ['--login', '-i'],
  },
  {
    title: `MSYS2`,
    shell: msys2Path,
    args: ['-defterm', '-here', '-no-start'],
  },
  {
    title: 'PowerShell',
    shell: powerShellPath,
    args: [],
  },
  {
    title: 'WSL / Ubuntu',
    shell: wslPath,
    args: [],
  },
].filter(profile => existsSync(profile.shell));

export default global.isWin ? windowsProfiles : posixProfiles;
