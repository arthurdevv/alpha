import { execFile } from 'child_process';
import { resolve } from 'path';

export interface GitInfo {
  branch: string;
  modified: number;
  staged: number;
  untracked: boolean;
  ahead: number;
  behind: number;
  isGitRepo: boolean;
}

interface CacheEntry {
  data: GitInfo;
  timestamp: number;
}

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

interface StatusCounts {
  modified: number;
  staged: number;
  untracked: boolean;
}

async function getStatus(cwd: string): Promise<StatusCounts> {
  const output = await execGit(['status', '--porcelain'], cwd);

  let modified = 0;
  let staged = 0;
  let untracked = false;

  if (!output) {
    return { modified, staged, untracked };
  }

  const lines = output.split('\n');

  for (const line of lines) {
    if (line.length < 2) continue;

    const indexStatus = line[0];
    const workTreeStatus = line[1];

    // Untracked files
    if (indexStatus === '?' && workTreeStatus === '?') {
      untracked = true;
      continue;
    }

    // Staged changes (index has modifications)
    if (indexStatus !== ' ' && indexStatus !== '?') {
      staged++;
    }

    // Unstaged modifications in working tree
    if (workTreeStatus !== ' ' && workTreeStatus !== '?') {
      modified++;
    }
  }

  return { modified, staged, untracked };
}

interface AheadBehind {
  ahead: number;
  behind: number;
}

async function getAheadBehind(cwd: string): Promise<AheadBehind> {
  try {
    const output = await execGit(
      ['rev-list', '--left-right', '--count', 'HEAD...@{upstream}'],
      cwd,
    );

    const parts = output.split(/\s+/);

    if (parts.length >= 2) {
      return {
        ahead: parseInt(parts[0], 10) || 0,
        behind: parseInt(parts[1], 10) || 0,
      };
    }

    return { ahead: 0, behind: 0 };
  } catch {
    // No upstream configured or other error
    return { ahead: 0, behind: 0 };
  }
}

export async function getGitInfo(cwd: string): Promise<GitInfo | null> {
  const resolvedCwd = resolve(cwd);

  // Check cache
  const cached = cache.get(resolvedCwd);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const [branch, status, aheadBehind] = await Promise.all([
      getBranch(resolvedCwd),
      getStatus(resolvedCwd),
      getAheadBehind(resolvedCwd),
    ]);

    const info: GitInfo = {
      branch,
      modified: status.modified,
      staged: status.staged,
      untracked: status.untracked,
      ahead: aheadBehind.ahead,
      behind: aheadBehind.behind,
      isGitRepo: true,
    };

    // Update cache
    cache.set(resolvedCwd, {
      data: info,
      timestamp: Date.now(),
    });

    return info;
  } catch {
    // Not a git repo or git not installed
    return null;
  }
}

export function clearGitCache(cwd?: string): void {
  if (cwd) {
    cache.delete(resolve(cwd));
  } else {
    cache.clear();
  }
}
