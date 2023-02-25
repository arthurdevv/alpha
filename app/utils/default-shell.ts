import { userInfo } from 'os';

const getDefaultShell = (): string => {
  const { env, platform } = process;

  if (platform === 'win32') {
    return env.COMSPEC || 'cmd.exe';
  }

  const { shell } = userInfo();

  if (shell) {
    return shell;
  }

  if (platform === 'darwin') {
    return env.SHELL || '/bin/zsh';
  }

  return env.SHELL || '/bin/sh';
};

export default getDefaultShell();
