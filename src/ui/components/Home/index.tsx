import { cx } from '@linaria/core';
import { useEffect, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/shallow';

import { normalizeKeyCombo } from 'ui/commands/keys';
import { executeCommand, registry } from 'ui/commands/registry';
import { resolveCommand } from 'ui/commands/resolver';
import { useFormattedKeymaps } from 'ui/hooks/useFormattedKeymaps';
import { useAppStore } from 'ui/store/app/store';
import { useTermsStore } from 'ui/store/terms/store';

import { AlphaIcon } from 'components/Icons';
import { Key, Keys } from 'components/Tooltip/styles';

import { Container, Footer, Logo, Version, Wrapper } from './styles';

export default function Home() {
  const origin = useTermsStore(s => s.origin);
  const { combos, setSettings, setKeymaps } = useAppStore(
    useShallow(s => ({
      combos: s.combos,
      setSettings: s.setSettings,
      setKeymaps: s.setKeymaps,
    })),
  );

  const showAllCommandsCombo = useFormattedKeymaps('app:commands') as string[];
  const { t } = useTranslation();

  const [shortcutsReady, setShortcutsReady] = useState<boolean>(false);

  const handleAnimationEnd = async () => {
    const keymaps = await ipc.keymaps.load();
    setKeymaps(keymaps);
    setShortcutsReady(true);
  };

  useEffect(() => {
    handleAnimationEnd(); // workaround, set this on <Logo /> onAnimationEnd event
  }, []);

  useEffect(() => {
    if (!shortcutsReady) return;

    async function handleKeydown(e: KeyboardEvent) {
      const combo = normalizeKeyCombo(e);
      const command = combos[combo];
      if (!command) return;

      const resolved = resolveCommand(command);
      const [event, arg] = resolved;

      e.preventDefault();
      await registry[event]?.(arg);
    }

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [shortcutsReady]);

  return (
    <Container className={cx(origin && 'hidden')}>
      <Logo>
        <AlphaIcon />
      </Logo>
      {/* {showAllCommandsCombo && (
        <Wrapper>
          {t('Press')}
          <Keys>
            {showAllCommandsCombo.map((key, index) => (
              <Key key={index}>{key}</Key>
            ))}
          </Keys>
          {t('to view all commands')}
        </Wrapper>
      )} */}
      <Footer>
        <Version onClick={() => executeCommand('app:modal', 'About')}>{ipc.app.version}</Version>
      </Footer>
    </Container>
  );
}
