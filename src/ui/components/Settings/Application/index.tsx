import { app } from '@electron/remote';
import { Fragment } from 'preact';
import { memo } from 'preact/compat';

import { execCommand } from 'main/keymaps/commands';
import type { SectionProps } from 'ui/types';

import { AlphaIcon } from 'components/Icons';

import { CheckForUpdates, Container, Logo, LogoText, Version } from './styles';

const Application: React.FC<SectionProps> = ({ options, t }) => (
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
        {t('Check for Updates')}
      </CheckForUpdates>
    </Container>
    {options}
  </Fragment>
);

export default memo(Application);
