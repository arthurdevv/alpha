import { memo } from 'preact/compat';
import styles from './styles.module.css';

interface GitStatusProps {
  gitInfo: {
    branch: string;
    modified: number;
    staged: number;
    untracked: boolean;
    ahead: number;
    behind: number;
    isGitRepo: boolean;
  } | null;
}

const BranchIcon = () => (
  <svg
    className={styles.branchIcon}
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"
    />
  </svg>
);

const GitStatus: React.FC<GitStatusProps> = ({ gitInfo }) => {
  if (!gitInfo || !gitInfo.isGitRepo) {
    return null;
  }

  const { branch, modified, staged, untracked, ahead, behind } = gitInfo;

  const hasChanges = modified > 0 || staged > 0 || untracked;
  const hasSyncStatus = ahead > 0 || behind > 0;

  return (
    <div className={styles.container}>
      {/* Branch name with icon */}
      <div className={styles.branch}>
        <BranchIcon />
        <span className={styles.branchName} title={branch}>
          {branch}
        </span>
      </div>

      {/* Status indicators */}
      {hasChanges && (
        <>
          <span className={styles.separator} />
          <div className={styles.status}>
            {/* Modified files */}
            {modified > 0 && (
              <span className={`${styles.indicator} ${styles.modified}`} title={`${modified} modified`}>
                {modified > 9 ? <span className={styles.modifiedDot} /> : modified}
              </span>
            )}

            {/* Staged files */}
            {staged > 0 && (
              <span className={`${styles.indicator} ${styles.staged}`} title={`${staged} staged`}>
                {staged > 9 ? <span className={styles.stagedDot} /> : staged}
              </span>
            )}

            {/* Untracked indicator */}
            {untracked && (
              <span className={styles.untracked} title="Untracked files">
                ?
              </span>
            )}
          </div>
        </>
      )}

      {/* Ahead/behind badges */}
      {hasSyncStatus && (
        <>
          <span className={styles.separator} />
          <div className={styles.syncStatus}>
            {ahead > 0 && (
              <span className={`${styles.badge} ${styles.ahead}`} title={`${ahead} commit(s) ahead`}>
                ↑{ahead}
              </span>
            )}
            {behind > 0 && (
              <span className={`${styles.badge} ${styles.behind}`} title={`${behind} commit(s) behind`}>
                ↓{behind}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(GitStatus);
