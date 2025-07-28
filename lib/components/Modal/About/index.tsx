import { h } from 'preact';
import { memo, useState } from 'preact/compat';

import { clipboard } from '@electron/remote';
import { debugVersions } from 'app/settings/constants';

import { BadgeItem, Container, Content, Tag, Tags } from '../styles';
import { Copied, Info, List, Wrapper } from './styles';

const About: React.FC<ModalProps> = ({ isVisible }) => {
  const [hasCopied, setCopied] = useState<boolean>(false);

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
        <Tag $isTitle>About</Tag>
        <Tag onClick={handleCopy}>Copy</Tag>
      </Tags>
      <Content>
        <Wrapper>
          <List>
            {Object.keys(debugVersions).map((key, index) => {
              const value = debugVersions[key];

              return (
                <Info key={index}>
                  <span>{key}</span>
                  <BadgeItem>{value}</BadgeItem>
                </Info>
              );
            })}
          </List>
        </Wrapper>
        <Copied $hasCopied={hasCopied}>Copied to clipboard</Copied>
      </Content>
    </Container>
  );
};

export default memo(About);
