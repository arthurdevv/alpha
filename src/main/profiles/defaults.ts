import { arch, homedir } from 'node:os';
import { resolve } from 'node:path';

import { resourcesPath } from 'main/core/themes';
import { defaultOptions as serialOptions } from 'main/profiles/serial';
import { defaultOptions as sshOptions } from 'main/profiles/ssh';
import { exists, runCommand } from 'main/utils/exec';
import { getRegistryPath } from 'main/utils/registry';
import type {
  DetectableProfile,
  Profile,
  SerialProfile,
  ShellProfile,
  SSHProfile,
} from 'shared/types';

const SYSTEM32 = `${process.env.SystemRoot ?? 'C:\\Windows'}\\system32`;

function getDetectableProfiles(detectable: DetectableProfile[], cwd: string): ShellProfile[] {
  const profiles: ShellProfile[] = [];

  for (const { id, name, registryKey, registryValue, bin, args } of detectable) {
    const root = getRegistryPath(registryKey, registryValue);
    if (!root) continue;

    profiles.push({
      id,
      name,
      group: 'External',
      options: { cwd, file: `${root}${bin}`, args, env: {} },
      type: 'shell',
      useNameAsTitle: false,
    });
  }

  return profiles;
}

export async function defaultProfiles(connections = false): Promise<Profile[]> {
  const cwd = homedir();

  const profiles: ShellProfile[] = [
    {
      id: 'cmd',
      name: 'Command Prompt',
      group: 'System',
      options: {
        cwd,
        file: `${SYSTEM32}\\cmd.exe`,
        args: [],
        env: {},
      },
      type: 'shell',
      useNameAsTitle: false,
    },
    {
      id: 'powershell',
      name: 'PowerShell',
      group: 'System',
      options: {
        cwd,
        file: `${SYSTEM32}\\WindowsPowerShell\\v1.0\\powershell.exe`,
        args: [],
        env: {},
      },
      type: 'shell',
      useNameAsTitle: false,
    },
    {
      id: 'wsl',
      name: 'WSL',
      group: 'System',
      options: {
        cwd,
        file: `${SYSTEM32}\\wsl.exe`,
        args: [],
        env: {},
      },
      type: 'shell',
      useNameAsTitle: false,
    },
    {
      id: 'clink',
      name: 'Clink',
      group: 'External',
      options: {
        cwd,
        file: 'C:\\Windows\\system32\\cmd.exe',
        args: ['/k', `${resourcesPath}\\clink\\clink_${arch()}.exe`, 'inject'],
        env: {},
      },
      type: 'shell',
      useNameAsTitle: false,
    },
    {
      id: 'msys2',
      name: 'MSYS2',
      group: 'External',
      options: {
        file: `${
          getRegistryPath(
            'Microsoft\\Windows\\CurrentVersion\\Uninstall\\MSYS2',
            'InstallLocation',
          ) ?? resolve(SYSTEM32, '..', 'msys64')
        }\\msys2_shell.cmd`,
        args: ['-defterm', '-here', '-no-start'],
        env: {},
        cwd: homedir(),
      },
      type: 'shell',
      useNameAsTitle: false,
    },
  ];

  const pwsh = await runCommand('where pwsh');
  if (pwsh) {
    profiles.push({
      id: 'pwsh',
      name: 'PowerShell 7+',
      group: 'System',
      options: {
        cwd,
        file: pwsh.trim(),
        args: [],
        env: {},
      },
      type: 'shell',
      useNameAsTitle: false,
    });
  }

  const detectable = [
    {
      id: 'git-bash',
      name: 'Git Bash',
      registryKey: 'GitForWindows',
      registryValue: 'InstallPath',
      bin: '\\bin\\bash.exe',
      args: ['--login', '-i'],
    },
    {
      id: 'cygwin',
      name: 'Cygwin',
      registryKey: 'Cygwin\\setup',
      registryValue: 'rootdir',
      bin: '\\bin\\bash.exe',
      args: ['--login', '-i'],
    },
  ];

  profiles.push(...getDetectableProfiles(detectable, cwd));

  const checks = await Promise.all(profiles.map(p => exists(p.options.file)));
  const shellProfiles = profiles.filter((_, i) => checks[i]);

  if (connections) {
    const connectionsProfiles: (SerialProfile | SSHProfile)[] = [
      {
        id: 'serial',
        name: 'Serial connection',
        group: 'Connections',
        options: serialOptions,
        type: 'serial',
        useNameAsTitle: false,
      },
      {
        id: 'ssh',
        name: 'SSH connection',
        group: 'Connections',
        options: sshOptions,
        type: 'ssh',
        useNameAsTitle: false,
      },
    ];

    return [...shellProfiles, ...connectionsProfiles];
  }

  return shellProfiles;
}
