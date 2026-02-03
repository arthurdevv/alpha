import { memo, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { clipboard } from '@electron/remote';
import { debugVersions } from 'app/settings/constants';

import { BadgeItem, Container, Content, Tag, Tags } from '../styles';
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
    <Container $width={20} $isVisible={isVisible}>
      <Tags>
        <Tag $isTitle>{t('About')}</Tag>
        <Tag onClick={handleCopy}>{t('Copy')}</Tag>
      </Tags>
      <Content>
        <Wrapper>
          <List>
            {Object.keys(debugVersions).map((key, index) => {
              const value = debugVersions[key];

              return (
                <Info key={index}>
                  <span>{t(key)}</span>
                  <BadgeItem>{value}</BadgeItem>
                </Info>
              );
            })}
          </List>
        </Wrapper>
        <Copied $hasCopied={hasCopied}>{t('Copied to clipboard')}</Copied>
      </Content>
    </Container>
  );
};

export default memo(About);
