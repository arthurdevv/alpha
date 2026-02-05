import { useState, useEffect } from 'preact/hooks';
import ipc from 'shared/ipc/renderer';

interface GitInfo {
  branch: string;
  modified: number;
  staged: number;
  untracked: boolean;
  ahead: number;
  behind: number;
  isGitRepo: boolean;
}

export function useGitStatus(instanceId: string | null): GitInfo | null {
  const [gitInfo, setGitInfo] = useState<GitInfo | null>(null);

  useEffect(() => {
    if (!instanceId) {
      setGitInfo(null);
      return;
    }

    const handleGitInfo = (data: { id: string; gitInfo: GitInfo | null }) => {
      if (data.id === instanceId) {
        setGitInfo(data.gitInfo);
      }
    };

    ipc.on('git:info', handleGitInfo);

    ipc.send('git:get-info', { id: instanceId });

    const intervalId = setInterval(() => {
      ipc.send('git:get-info', { id: instanceId });
    }, 1500);

    return () => {
      clearInterval(intervalId);
    };
  }, [instanceId]);

  return gitInfo;
}

export default useGitStatus;
