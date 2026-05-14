import { homedir, hostname, uptime as uptimesecs, userInfo } from 'node:os';

import { screen } from 'electron';

import type { SystemInfo } from 'shared/types';
import { unit } from 'ui/utils/misc';

function getUptime(): string {
  const seconds = uptimesecs();

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return [unit(days, 'day'), unit(hours, 'hour'), unit(minutes, 'minute')]
    .filter(Boolean)
    .join(', ');
}

export async function getSystemInfo(): Promise<SystemInfo> {
  const { username } = userInfo();
  const {
    workAreaSize: { width, height },
  } = screen.getPrimaryDisplay();

  return {
    username,
    hostname: hostname(),
    homedir: homedir(),
    root: `${username}@${hostname()}`,
    uptime: getUptime(),
    resolution: `${width}x${height}`,
  };
}
