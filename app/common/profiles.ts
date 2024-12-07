import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { getSettings } from 'app/settings';
import { appExec, appPath } from 'app/settings/constants';
import getRegistryPath from 'app/utils/registry-path';

const { app }: typeof Electron =
  process.type === 'browser'
    ? require('electron')
    : require('@electron/remote');

const systemProfiles: IProfile[] = [
  {
    id: 'cmd',
    name: 'Command Prompt',
    group: 'System',
    title: false,
    options: {
      shell: 'C:\\Windows\\system32\\cmd.exe',
      args: [],
      env: {},
    },
  },
  {
    id: 'clink',
    name: 'Clink',
    group: 'System',
    title: false,
    options: {
      shell: 'C:\\Windows\\system32\\cmd.exe',
      args: [
        '/k',
        app.isPackaged
          ? `${appExec}\\resources\\clink\\clink_${process.arch}.exe`
          : `${appPath}\\app\\utils\\clink\\clink_${process.arch}.exe`,
        'inject',
      ],
      env: {},
    },
  },
  {
    id: 'cygwin',
    name: 'Cygwin',
    group: 'System',
    title: false,
    options: {
      shell: `${getRegistryPath('Cygwin\\setup', 'rootdir')}\\bin\\bash.exe`,
      args: ['--login', '-i'],
      env: {},
    },
  },
  {
    id: 'git-bash',
    name: 'Git Bash',
    group: 'System',
    title: false,
    options: {
      shell: `${getRegistryPath(
        'GitForWindows',
        'InstallPath',
      )}\\bin\\bash.exe`,
      args: ['--login', '-i'],
      env: {},
    },
  },
  {
    id: 'msys2',
    name: `MSYS2`,
    group: 'System',
    title: false,
    options: {
      shell: `C:\\msys64\\msys2_shell.cmd`,
      args: ['-defterm', '-here', '-no-start'],
      env: {},
    },
  },
  {
    id: 'powershell',
    name: 'PowerShell',
    group: 'System',
    title: false,
    options: {
      shell: 'C:\\Windows\\system32\\WindowsPowerShell\\v1.0\\powershell.exe',
      args: [],
      env: {},
    },
  },
  {
    id: 'wsl',
    name: 'WSL',
    group: 'System',
    title: false,
    options: {
      shell: 'C:\\Windows\\system32\\wsl.exe',
      args: [],
      env: {},
    },
  },
].filter(({ options }) => existsSync(options.shell));

function createProfile(): IProfile {
  return {
    id: uuidv4(),
    name: '',
    group: 'Ungrouped',
    title: false,
    options: {
      shell: '',
      cwd: '',
      env: {},
      args: [],
    },
  };
}

function getGroups(array?: boolean) {
  const groups: Record<string, IProfile[]> = {};

  let { profiles } = getSettings();

  profiles = profiles.concat(systemProfiles);

  profiles.forEach(profile => {
    let { group } = profile;

    groups[group] = group in groups ? [...groups[group], profile] : [profile];
  });

  return array ? profiles : groups;
}

function getProfileByKey(key: keyof IProfile, value: any): IProfile {
  const groups = getGroups(true) as IProfile[];

  const profile = groups.find(profile => profile[key] === value);

  return profile as IProfile;
}

function getDefaultProfile(profile?: IProfile): IProfile {
  const { defaultProfile } = getSettings();

  return profile || getProfileByKey('id', defaultProfile);
}

export { systemProfiles, createProfile, getGroups, getDefaultProfile };
