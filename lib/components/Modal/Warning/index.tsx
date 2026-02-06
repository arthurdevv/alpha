import { memo } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { clipboard } from '@electron/remote';
import { useSettings } from 'app/settings/listeners';

import { Preview, Title, Wrapper } from './styles';
import styles from '../styles.module.css';

const Warning: React.FC<ModalProps> = ({ handleModal, isVisible }) => {
  const [settings] = useSettings();

  const data = clipboard.readText('clipboard');

  const { t } = useTranslation();

  const handlePaste = () => {
    document.execCommand('paste');

    handleModal();
  };

  return (
    <div
      className={`${styles.container} ${isVisible ? styles.containerVisible : styles.containerHidden}`}
      style={{ maxWidth: '34rem' }}
    >
      <div className={styles.tags}>
        <div className={`${styles.tag} ${styles.tagTitle}`}>{t('Warning')}</div>
        <div className={styles.tag} onClick={handleModal}>{t('Cancel')}</div>
        <div className={styles.tag} onClick={handlePaste}>{t('Paste anyway')}</div>
      </div>
      <div className={styles.content}>
        <Wrapper>
          <Title>
            {t(
              'The clipboard text has multiple lines, which might lead to unexpected execution.',
            )}
          </Title>
          <Preview style={{ fontFamily: settings.fontFamily }}>{data}</Preview>
        </Wrapper>
      </div>
    </div>
  );
};

export default memo(Warning);
