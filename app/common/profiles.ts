import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { app } from '@electron/remote';
import { getSettings } from 'app/settings';
import { appExec, appPath } from 'app/settings/constants';
import getRegistryPath from 'app/utils/registry-path';

const systemProfiles = [
  {
    id: '0',
    name: 'Command Prompt',
    group: 'System',
    options: {
      shell: 'C:\\Windows\\system32\\cmd.exe',
      args: [],
    },
  },
  {
    id: '1',
    name: 'Clink',
    group: 'System',
    options: {
      shell: 'C:\\Windows\\system32\\cmd.exe',
      args: [
        '/k',
        app.isPackaged
          ? `${appExec}\\resources\\clink\\clink_${process.arch}.exe`
          : `${appPath}\\app\\utils\\clink\\clink_${process.arch}.exe`,
        'inject',
      ],
    },
  },
  {
    id: '2',
    name: 'Cygwin',
    group: 'System',
    options: {
      shell: `${getRegistryPath('Cygwin\\setup', 'rootdir')}\\bin\\bash.exe`,
      args: ['--login', '-i'],
    },
  },
  {
    id: '3',
    name: 'Git Bash',
    group: 'System',
    options: {
      shell: `${getRegistryPath(
        'GitForWindows',
        'InstallPath',
      )}\\bin\\bash.exe`,
      args: ['--login', '-i'],
    },
  },
  {
    id: '4',
    name: `MSYS2`,
    group: 'System',
    options: {
      shell: `C:\\msys64\\msys2_shell.cmd`,
      args: ['-defterm', '-here', '-no-start'],
    },
  },
  {
    id: '5',
    name: 'PowerShell',
    group: 'System',
    options: {
      shell: 'C:\\Windows\\system32\\WindowsPowerShell\\v1.0\\powershell.exe',
      args: [],
    },
  },
  {
    id: '6',
    name: 'WSL',
    group: 'System',
    options: {
      shell: 'C:\\Windows\\system32\\wsl.exe',
      args: [],
    },
  },
].filter(({ options }) => existsSync(options.shell)) as unknown as IProfile[];

const createProfile = (): IProfile => ({
  id: uuidv4(),
  name: '',
  group: 'Ungrouped',
  title: false,
  options: {
    shell: '',
    cwd: undefined,
    env: {},
    args: [],
  },
});

const getGroups = (
  array?: boolean,
): IProfile[] | Record<string, IProfile[]> => {
  const groups: Record<string, IProfile[]> = {};

  let { profiles } = getSettings();

  profiles = profiles.concat(systemProfiles);

  profiles.forEach(profile => {
    let { group } = profile;

    groups[group] = group in groups ? [...groups[group], profile] : [profile];
  });

  return array ? profiles : groups;
};

const getProfileByProp = (key: keyof IProfile, value: any): IProfile => {
  const groups = getGroups(true) as IProfile[];

  const profile = groups
    .concat(systemProfiles)
    .filter(profile => profile[key] === value)[0];

  return profile;
};

export { systemProfiles, createProfile, getGroups, getProfileByProp };
