import { existsSync } from 'fs';
import { execSync } from 'child_process';

const OPENSSH_AGENT_PIPE = '\\\\.\\pipe\\openssh-ssh-agent';

export default (): string => {
  if (existsSync(OPENSSH_AGENT_PIPE)) return OPENSSH_AGENT_PIPE;

  try {
    const tasklist = execSync('tasklist').toString().toLowerCase();

    if (tasklist.includes('pageant.exe')) return 'pageant';
  } catch (error) {
    console.error(error);
  }

  return process.env.SSH_AUTH_SOCK!;
};
