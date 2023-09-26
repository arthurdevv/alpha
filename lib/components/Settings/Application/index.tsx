import { h } from 'preact';
import { memo } from 'preact/compat';

import { app } from '@electron/remote';
import { AlphaIcon } from 'lib/components/Icon';

import { Container, Logo, LogoText, Version, CheckForUpdates } from './styles';

const Application: React.FC = () => (
  <Container>
    <Logo>
      <AlphaIcon />
      <LogoText>LPHA</LogoText>
      <Version>{app.getVersion()}</Version>
    </Logo>
    <CheckForUpdates onClick={() => window.send('app:check-for-updates')}>
      Check for Updates
    </CheckForUpdates>
  </Container>
);

export default memo(Application);
