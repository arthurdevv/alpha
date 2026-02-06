import { memo, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { clipboard } from '@electron/remote';
import { debugVersions } from 'app/settings/constants';

import styles from '../styles.module.css';
import { Copied, Info, List, Wrapper } from './styles';

const About: React.FC<ModalProps> = ({ isVisible }) => {
  const [hasCopied, setCopied] = useState<boolean>(false);

  const { t } = useTranslation();

  const handleCopy = () => {
    const text = JSON.stringify(debugVersions, null, '\t').replace(
      /[,{}"]/g,
      '',
    );

    clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      className={`${styles.container} ${isVisible ? styles.containerVisible : styles.containerHidden}`}
      style={{ maxWidth: '20rem' }}
    >
      <div className={styles.tags}>
        <div className={`${styles.tag} ${styles.tagTitle}`}>{t('About')}</div>
        <div className={styles.tag} onClick={handleCopy}>{t('Copy')}</div>
      </div>
      <div className={styles.content}>
        <Wrapper>
          <List>
            {Object.keys(debugVersions).map((key, index) => {
              const value = debugVersions[key];

              return (
                <Info key={index}>
                  <span>{t(key)}</span>
                  <span className={styles.badgeItem}>{value}</span>
                </Info>
              );
            })}
          </List>
        </Wrapper>
        <Copied $hasCopied={hasCopied}>{t('Copied to clipboard')}</Copied>
      </div>
    </div>
  );
};

export default memo(About);
