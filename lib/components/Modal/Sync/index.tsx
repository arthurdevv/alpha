import { memo, useEffect, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { writeSettings } from 'app/settings';
import fetchConfig from 'app/api/fetch-config';
import storage from 'app/utils/local-storage';
import { getDateFormatted } from 'lib/utils';

import styles from '../styles.module.css';

const Sync: React.FC<ModalProps> = (props: ModalProps) => {
  const [gistID, setGistID] = useState<string>('');

  const [syncInfo, setSyncInfo] = useState({ filename: '', date: '' });

  const { t, i18n } = useTranslation();

  const handleInput = ({ currentTarget }) => {
    const { value } = currentTarget;

    setGistID(value);
  };

  const handleSync = async () => {
    const file = await fetchConfig(gistID);

    if (file) {
      const { filename, content } = file;

      writeSettings(content, () => {
        const syncInfo = { filename, date: getDateFormatted(i18n.language) };

        storage.updateItem('lastSync', syncInfo);

        setSyncInfo(syncInfo);
      });
    }

    props.handleModal();
  };

  useEffect(() => {
    const lastSync = storage.parseItem('lastSync');

    if (lastSync) setSyncInfo(lastSync);
  }, []);

  return (
    <div
      className={`${styles.container} ${props.isVisible ? styles.containerVisible : styles.containerHidden}`}
      style={{ maxWidth: '30rem' }}
    >
      <div className={styles.tags}>
        <div className={`${styles.tag} ${styles.tagTitle}`}>{t('Config file')}</div>
        <div className={styles.tag} onClick={handleSync}>{t('Import')}</div>
        <div className={styles.tag} onClick={props.handleModal}>{t('Cancel')}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.search}>
          <input
            className={styles.searchInput}
            placeholder={t('Insert a valid Gist ID')}
            onChange={handleInput}
          />
        </div>
      </div>
      {syncInfo.filename && syncInfo.date && (
        <div className={styles.tags} style={{ marginTop: '0.5rem' }}>
          <div className={`${styles.tag} ${styles.tagTitle}`}>
            {t('Last import: {{syncInfo.date}} from {{syncInfo.filename}}', {
              syncInfo,
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Sync);
