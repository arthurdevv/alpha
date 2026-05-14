import { exec } from 'node:child_process';
import { access } from 'node:fs/promises';
import { promisify } from 'node:util';

import { reportError } from 'shared/error-reporter';

const execAsync = promisify(exec);

export async function runCommand(
  command: string,
  regex?: RegExp,
  cwd?: string,
): Promise<string | null> {
  try {
    const { stdout } = await execAsync(command, { encoding: 'utf-8', cwd });
    const output = stdout.trim();

    if (regex) {
      const match = output.match(regex);
      return match ? match[1] : null;
    }

    return output;
  } catch (error) {
    reportError(error);
    return null;
  }
}

export async function findInPath(executable: string): Promise<string | null> {
  try {
    const result = await runCommand(`where ${executable}`);
    return result ? result.trim().split('\n')[0] : null;
  } catch (error) {
    reportError(error);
    return null;
  }
}

export async function exists(path: string): Promise<boolean> {
  return access(path)
    .then(() => true)
    .catch(() => false);
}
