import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { getSettings } from 'app/settings';
import { HOMEDIR, resourcesPath } from 'app/settings/constants';
import { defaultOptions as sshOptions } from 'app/connections/ssh';
import { defaultOptions as serialOptions } from 'app/connections/serial';
import getRegistryPath from 'app/utils/registry-path';

export const defaultProfiles = [
  {
    id: 'cmd',
    name: 'Command Prompt',
    group: 'System',
    options: {
      file: 'C:\\Windows\\system32\\cmd.exe',
      args: [],
      env: {},
      cwd: HOMEDIR,
    },
    title: false,
    type: 'shell',
  },
  {
    id: 'clink',
    name: 'Clink',
    group: 'External',
    options: {
      file: 'C:\\Windows\\system32\\cmd.exe',
      args: [
        '/k',
        `${resourcesPath}\\clink\\clink_${process.arch}.exe`,
        'inject',
      ],
      env: {},
      cwd: HOMEDIR,
    },
    title: false,
    type: 'shell',
  },
  {
    id: 'cygwin',
    name: 'Cygwin',
    group: 'External',
    options: {
      file: `${getRegistryPath('Cygwin\\setup', 'rootdir')}\\bin\\bash.exe`,
      args: ['--login', '-i'],
      env: {},
      cwd: HOMEDIR,
    },
    title: false,
    type: 'shell',
  },
  {
    id: 'git-bash',
    name: 'Git Bash',
    group: 'External',
    options: {
      file: `${getRegistryPath('GitForWindows', 'InstallPath')}\\bin\\bash.exe`,
      args: ['--login', '-i'],
      env: {},
      cwd: HOMEDIR,
    },
    title: false,
    type: 'shell',
  },
  {
    id: 'msys2',
    name: `MSYS2`,
    group: 'External',
    options: {
      file: `C:\\msys64\\msys2_shell.cmd`,
      args: ['-defterm', '-here', '-no-start'],
      env: {},
      cwd: HOMEDIR,
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
      cwd: HOMEDIR,
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
      cwd: HOMEDIR,
    },
    title: false,
    type: 'shell',
  },
]
  .filter(({ options }) => existsSync(options.file))
  .sort((a, b) =>
    a.group.toLowerCase().localeCompare(b.group.toLowerCase()),
  ) as IProfile<'shell'>[];

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
] as IProfile<'ssh' | 'serial'>[];

function createProfile(t: any, template?: IProfile | null): IProfile {
  const profile = { ...(template ?? defaultProfiles[0]) };

  return {
    ...profile,
    id: uuidv4(),
    name: t('{{profile.name}} copy', { profile }),
    group: 'Ungrouped',
  };
}

function getGroups(
  array?: boolean,
  connections?: boolean,
): IProfile[] | Record<string, IProfile[]> {
  const groups: Record<string, IProfile[]> = {};

  let { profiles } = getSettings();

  profiles = profiles.concat([...defaultProfiles]);

  if (connections) {
    profiles = profiles.concat([...connectionsProfiles]);
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

  return getDefaultProfile(profile);
}

function getDefaultProfile(profile?: IProfile): IProfile {
  if (profile) return profile;

  const { defaultProfile } = getSettings();

  return getProfileByKey('id', defaultProfile);
}

function getAllProfiles(): IProfile[] {
  const { profiles } = getSettings();

  return profiles.concat(defaultProfiles);
}

function sortGroups(groups: any): string[] {
  const weights = { Ungrouped: -1, External: 98, System: 99, Connections: 100 };

  if (Array.isArray(groups)) {
    return [...groups].sort((a, b) => {
      const weightA = weights[a] ?? 0;
      const weightB = weights[b] ?? 0;

      if (weightA !== weightB) return weightA - weightB;

      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
  }

  return [];
}

export {
  createProfile,
  getGroups,
  getProfileByKey,
  getDefaultProfile,
  getAllProfiles,
  sortGroups,
};
