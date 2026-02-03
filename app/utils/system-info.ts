import { homedir, hostname, uptime as uptimesecs, userInfo } from 'os';
import { execSync } from 'child_process';
import { resolve } from 'path';

function runCommand(
  command: string,
  regex?: RegExp,
  cwd?: string,
  value = '10.0.00000.0000',
): string {
  try {
    const output = execSync(command, { encoding: 'utf-8', cwd }).trim();

    if (regex) {
      const match = output.match(regex);

      return match ? match[1] : value;
    }

    return output;
  } catch {
    return value;
  }
}

function getUptime(): string {
  const seconds = uptimesecs();

  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const uptime: string[] = [];

  if (days > 0) uptime.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) uptime.push(`${hours} hour${hours > 1 ? 's' : ''}`);

  uptime.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);

  return uptime.join(', ');
}

export function getCurrentBranch(cwd: string) {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: resolve(cwd),
      stdio: ['ignore'],
    });

    return branch ? branch.toString().trim() : null;
  } catch {
    return null;
  }
}

export function renderSystemInfo(color?: string, fw?: string | number) {
  const colorize = (text: string) =>
    `<span style="color:${color};font-weight:${fw};">${text}</span>`;

  return {
    windows: `
lllllllllll  lllllllllll
lllllllllll  lllllllllll
lllllllllll  lllllllllll
lllllllllll  lllllllllll

lllllllllll  lllllllllll
lllllllllll  lllllllllll
lllllllllll  lllllllllll
lllllllllll  lllllllllll
`,
    info: `
${colorize(systemInfo.username)}@${colorize(systemInfo.hostname)}
${'-'.repeat(systemInfo.root.length)}
${colorize('Uptime')}: ${systemInfo.uptime}
${colorize('Shell')}: Powershell v${systemInfo.shell}
${colorize('Resolution')}: ${systemInfo.resolution}
${colorize('Terminal')}: Alpha
`,
  };
}

const { username } = userInfo();

const systemInfo = {
  username,
  hostname: hostname(),
  home: homedir(),
  root: `${username}@${hostname()}`,
  uptime: getUptime(),
  resolution: `${screen.width}x${screen.height}`,
  cmd: runCommand('ver', /Version\s+([\d.]+)/i),
  shell: runCommand('powershell $PSVersionTable.PSVersion.ToString()'),
};

export default systemInfo;
