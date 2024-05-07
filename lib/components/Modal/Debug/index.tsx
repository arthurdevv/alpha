import { h } from 'preact';
import { memo, useState } from 'preact/compat';

import { versions } from 'process';
import { arch, homedir, release } from 'os';
import { app, clipboard } from '@electron/remote';

import { BadgeItem, Container, Content, Tag, Tags } from '../styles';
import { Copied, Info, List, Wrapper } from './styles';

const Debug: React.FC<ModalProps> = ({ isVisible }) => {
  const [hasCopied, setCopied] = useState<boolean>(false);

  const setup = app.getAppPath().includes(homedir()) ? 'user' : 'system';

  const debug = {
    Version: `${app.getVersion()} (${setup} setup)`,
    Electron: versions.electron,
    'Node.js': versions.node,
    Chromium: versions.chrome,
    V8: versions.v8,
    OS: `Windows NT ${release()} ${arch()}`,
  };

  const handleCopy = () => {
    const text = JSON.stringify(debug, null, '\t').replace(/[,{}"]/g, '');

    clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Container $width={20} $isVisible={isVisible}>
      <Tags>
        <Tag>About</Tag>
        <Tag $isAction onClick={handleCopy}>
          Copy
        </Tag>
      </Tags>
      <Content>
        <Wrapper>
          <List>
            {Object.keys(debug).map((key, index) => {
              const value = debug[key];

              return (
                <Info key={index}>
                  <span>{key}:</span>
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

export default memo(Debug);
