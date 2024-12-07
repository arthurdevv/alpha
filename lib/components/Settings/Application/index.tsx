import { Fragment, h } from 'preact';
import { memo } from 'preact/compat';

import { app } from '@electron/remote';
import { execCommand } from 'app/keymaps/commands';

import { AlphaIcon } from 'lib/components/Icons';
import { CheckForUpdates, Container, Logo, LogoText, Version } from './styles';

const Application: React.FC<SectionProps> = ({ options }) => (
  <Fragment>
    <Container>
      <Logo>
        <AlphaIcon />
        <LogoText>LPHA</LogoText>
        <Version onClick={() => execCommand('app:modal', 'About')}>
          {app.getVersion()}
        </Version>
      </Logo>
      <CheckForUpdates onClick={() => execCommand('app:check-for-updates')}>
        Check for Updates
      </CheckForUpdates>
    </Container>
    {options}
  </Fragment>
);

export default memo(Application);
