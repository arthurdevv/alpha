import { memo, useEffect, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { writeSettings } from 'app/settings';
import fetchConfig from 'app/api/fetch-config';
import storage from 'app/utils/local-storage';
import { getDateFormatted } from 'lib/utils';

import { Container, Content, Search, SearchInput, Tag, Tags } from '../styles';

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
    <Container $width={30} $isVisible={props.isVisible}>
      <Tags>
        <Tag $isTitle>{t('Config file')}</Tag>
        <Tag onClick={handleSync}>{t('Import')}</Tag>
        <Tag onClick={props.handleModal}>{t('Cancel')}</Tag>
      </Tags>
      <Content>
        <Search>
          <SearchInput
            placeholder={t('Insert a valid Gist ID')}
            onChange={handleInput}
          />
        </Search>
      </Content>
      {syncInfo.filename && syncInfo.date && (
        <Tags style={{ marginTop: '0.5rem' }}>
          <Tag $isTitle>
            {t('Last import: {{syncInfo.date}} from {{syncInfo.filename}}', {
              syncInfo,
            })}
          </Tag>
        </Tags>
      )}
    </Container>
  );
};

export default memo(Sync);
