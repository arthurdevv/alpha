import { execFile } from 'child_process';
import { resolve } from 'path';
import { reportError } from 'shared/error-reporter';

const CACHE_TTL = 500;
const cache = new Map<string, CacheEntry>();

function execGit(args: string[], cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile('git', args, { cwd, encoding: 'utf-8' }, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

async function getBranch(cwd: string): Promise<string> {
  return execGit(['rev-parse', '--abbrev-ref', 'HEAD'], cwd);
}

async function getStatus(cwd: string): Promise<StatusCounts> {
  const output = await execGit(['status', '--porcelain'], cwd);

  let modified = 0;
  let staged = 0;
  let untracked = 0;

  if (!output) {
    return { modified, staged, untracked };
  }

  const lines = output.split('\n');

  for (const line of lines) {
    if (line.length < 2) continue;

    const [indexStatus, workTreeStatus] = line;

    if (indexStatus === '?' && workTreeStatus === '?') {
      untracked++;
    }

    if (indexStatus !== ' ' && indexStatus !== '?') {
      staged++;
    }

    if (workTreeStatus !== ' ' && workTreeStatus !== '?') {
      modified++;
    }
  }

  return { modified, staged, untracked };
}

async function getAheadBehind(cwd: string): Promise<AheadBehind> {
  try {
    const output = await execGit(
      ['rev-list', '--left-right', '--count', 'HEAD...@{upstream}'],
      cwd,
    );

    const parts = output.split(/\s+/);

    if (parts.length >= 2) {
      const [ahead, behind] = parts.map(v => parseInt(v, 10) || 0);

      return { ahead, behind };
    }
  } catch (error) {
    reportError(error);
  }

  return { ahead: 0, behind: 0 };
}

async function getGitInfo(cwd: string): Promise<IGitInfo | null> {
  const resolvedCwd = resolve(cwd);
  const cached = cache.get(resolvedCwd);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.info;

  try {
    const [branch, status, aheadBehind] = await Promise.all([
      getBranch(resolvedCwd),
      getStatus(resolvedCwd),
      getAheadBehind(resolvedCwd),
    ]);

    const info: IGitInfo = {
      branch,
      modified: status.modified,
      staged: status.staged,
      untracked: status.untracked,
      ahead: aheadBehind.ahead,
      behind: aheadBehind.behind,
      isRepo: true,
    };

    cache.set(resolvedCwd, { info, timestamp: Date.now() });

    return info;
  } catch (error) {
    reportError(error);
  }

  return null;
}

export default getGitInfo;
