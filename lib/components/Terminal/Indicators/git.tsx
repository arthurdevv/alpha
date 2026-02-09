import { memo } from 'preact/compat';

import { useGitStatus } from 'lib/hooks/useGitStatus';

import { BadgeItem, Badges } from './styles';

const indicators = {
  modified: { icon: 'M', title: 'modified' },
  staged: { icon: '✓', title: 'staged' },
  untracked: { icon: '?', title: 'untracked' },
  ahead: { icon: '↑', title: 'commit(s) ahead' },
  behind: { icon: '↓', title: 'commit(s) behind' },
};

const GitStatus: React.FC<{ id: string }> = ({ id }) => {
  const info = useGitStatus(id);

  if (!info?.isRepo)
    return (
      <div style={{ marginRight: '0.25rem' }}>Git status is not available</div>
    );

  const statusEntries = Object.entries(info).filter(([key, value]) => {
    return typeof value === 'number' && value > 0 && key;
  });

  return (
    <>
      <span title={info.branch}>{info.branch}</span>
      {statusEntries.length ? (
        <Badges>
          {statusEntries.map(([key, value]) => {
            const { icon, title } = indicators[key];

            return (
              <BadgeItem title={`${value} ${title}`}>
                {icon}&nbsp;{value}
              </BadgeItem>
            );
          })}
        </Badges>
      ) : (
        <></>
      )}
    </>
  );
};

export default memo(GitStatus);
