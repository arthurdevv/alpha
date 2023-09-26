import { userInfo } from 'os';

const getDefaultShell = () => {
  const { env, platform } = process;

  if (platform === 'win32') {
    return env.COMSPEC || 'cmd.exe';
  }

  const { shell } = userInfo();

  return env.SHELL || shell;
};

export default getDefaultShell();
