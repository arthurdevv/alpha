import { memo } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { clipboard } from '@electron/remote';
import { useSettings } from 'app/settings/listeners';

import { Preview, Title, Wrapper } from './styles';
import { Container, Content, Tag, Tags } from '../styles';

const Warning: React.FC<ModalProps> = ({ handleModal, isVisible }) => {
  const [settings] = useSettings();

  const data = clipboard.readText('clipboard');

  const { t } = useTranslation();

  const handlePaste = () => {
    document.execCommand('paste');

    handleModal();
  };

  return (
    <Container $width={34} $isVisible={isVisible}>
      <Tags>
        <Tag $isTitle>{t('Warning')}</Tag>
        <Tag onClick={handleModal}>{t('Cancel')}</Tag>
        <Tag onClick={handlePaste}>{t('Paste anyway')}</Tag>
      </Tags>
      <Content>
        <Wrapper>
          <Title>
            {t(
              'The clipboard text has multiple lines, which might lead to unexpected execution.',
            )}
          </Title>
          <Preview style={{ fontFamily: settings.fontFamily }}>{data}</Preview>
        </Wrapper>
      </Content>
    </Container>
  );
};

export default memo(Warning);
