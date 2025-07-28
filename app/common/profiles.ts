import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { getSettings } from 'app/settings';
import { appExec, appPath } from 'app/settings/constants';
import { defaultOptions as sshOptions } from 'app/connections/ssh';
import { defaultOptions as serialOptions } from 'app/connections/serial';
import getRegistryPath from 'app/utils/registry-path';

const { app }: typeof Electron =
  process.type === 'browser'
    ? require('electron')
    : require('@electron/remote');

const systemProfiles = [
  {
    id: 'cmd',
    name: 'Command Prompt',
    group: 'System',
    options: {
      file: 'C:\\Windows\\system32\\cmd.exe',
      args: [],
      env: {},
      cwd: undefined,
    },
    title: false,
    type: 'shell',
  },
  {
    id: 'clink',
    name: 'Clink',
    group: 'System',
    options: {
      file: 'C:\\Windows\\system32\\cmd.exe',
      args: [
        '/k',
        `${
          app.isPackaged ? appExec : appPath
        }\\resources\\clink\\clink_${process.arch}.exe`,
        'inject',
      ],
      env: {},
      cwd: undefined,
    },
    title: false,
    type: 'shell',
  },
  {
    id: 'cygwin',
    name: 'Cygwin',
    group: 'System',
    options: {
      file: `${getRegistryPath('Cygwin\\setup', 'rootdir')}\\bin\\bash.exe`,
      args: ['--login', '-i'],
      env: {},
      cwd: undefined,
    },
    title: false,
    type: 'shell',
  },
  {
    id: 'git-bash',
    name: 'Git Bash',
    group: 'System',
    options: {
      file: `${getRegistryPath('GitForWindows', 'InstallPath')}\\bin\\bash.exe`,
      args: ['--login', '-i'],
      env: {},
      cwd: undefined,
    },
    title: false,
    type: 'shell',
  },
  {
    id: 'msys2',
    name: `MSYS2`,
    group: 'System',
    options: {
      file: `C:\\msys64\\msys2_shell.cmd`,
      args: ['-defterm', '-here', '-no-start'],
      env: {},
      cwd: undefined,
    },
    title: false,
    type: 'shell',
  },
  {
    id: 'powershell',
    name: 'PowerShell',
    group: 'System',
    options: {
      file: 'C:\\Windows\\system32\\WindowsPowerShell\\v1.0\\powershell.exe',
      args: [],
      env: {},
      cwd: undefined,
    },
    title: false,
    type: 'shell',
  },
  {
    id: 'wsl',
    name: 'WSL',
    group: 'System',
    options: {
      file: 'C:\\Windows\\system32\\wsl.exe',
      args: [],
      env: {},
      cwd: undefined,
    },
    title: false,
    type: 'shell',
  },
].filter(({ options }) => existsSync(options.file)) as IProfile[];

const connectionsProfiles = [
  {
    id: 'serial',
    name: 'Serial connection',
    group: 'Connections',
    options: serialOptions,
    title: false,
    type: 'serial',
  },
  {
    id: 'ssh',
    name: 'SSH connection',
    group: 'Connections',
    options: sshOptions,
    title: false,
    type: 'ssh',
  },
] as IProfile[];

function createProfile(template?: IProfile | null): IProfile {
  template = template ?? systemProfiles[0];

  return {
    ...template,
    id: uuidv4(),
    name: `${template.name} copy`,
    group: 'Ungrouped',
  };
}

function getGroups(
  array?: boolean,
  connections?: boolean,
): IProfile[] | Record<string, IProfile[]> {
  const groups: Record<string, IProfile[]> = {};

  let { profiles } = getSettings();

  profiles = profiles.concat(systemProfiles);

  if (connections) {
    profiles = profiles.concat(connectionsProfiles);
  }

  profiles.forEach(profile => {
    const { group } = profile;

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

  return profile ?? getProfileByKey('id', defaultProfile);
}

export { systemProfiles, createProfile, getGroups, getDefaultProfile };
