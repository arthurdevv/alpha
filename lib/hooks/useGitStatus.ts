import { useEffect, useState } from 'preact/hooks';
import ipc from 'shared/ipc/renderer';

function useGitStatus(instanceId: string | null): IGitInfo | null {
  const [gitInfo, setGitInfo] = useState<IGitInfo | null>(null);

  useEffect(() => {
    if (!instanceId) {
      setGitInfo(null);
      return;
    }

    ipc.on(
      'terminal:git-info',
      (data: { id: string; info: IGitInfo | null }) => {
        if (data.id !== instanceId) return;

        setGitInfo(data.info);
      },
    );

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

export { useGitStatus };
