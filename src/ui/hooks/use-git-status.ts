import { useEffect, useState } from 'preact/hooks';

import type { GitInfo } from 'shared/types';

export function useGitStatus(instanceId: string | null): GitInfo | null {
  const [gitInfo, setGitInfo] = useState<GitInfo | null>(null);

  useEffect(() => {
    if (!instanceId) {
      setGitInfo(null);
      return;
    }

    ipc.on('terminal:git-info', (data: { id: string; info: GitInfo | null }) => {
      if (data.id !== instanceId) return;

      setGitInfo(data.info);
    });

    ipc.send('terminal:get-git-info', { id: instanceId });

    const interval = setInterval(() => {
      ipc.send('terminal:get-git-info', { id: instanceId });
    }, 1500);

    return () => {
      ipc.removeAllListeners('terminal:git-info');

      clearInterval(interval);
    };
  }, [instanceId]);

  return gitInfo;
}
