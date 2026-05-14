import { useTranslation } from 'react-i18next';

import { executeCommand } from 'ui/commands/registry';
import type { SectionProps } from 'ui/types';

import { AlphaIcon } from 'components/Icons';

import { CheckForUpdates, Container, Logo, Version } from './styles';

export default function Application({ children }: SectionProps) {
  const { t } = useTranslation();

  return (
    <>
      <Container>
        <Logo>
          <AlphaIcon />
          <Version onClick={() => executeCommand('app:modal', 'About')}>{ipc.app.version}</Version>
        </Logo>
        <CheckForUpdates onClick={() => executeCommand('app:check-for-updates')}>
          {t('Check for Updates')}
        </CheckForUpdates>
      </Container>
      {children}
    </>
  );
}
