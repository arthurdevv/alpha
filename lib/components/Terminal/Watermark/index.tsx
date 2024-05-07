import { h } from 'preact';
import { memo } from 'preact/compat';

import { app } from '@electron/remote';
import { execCommand } from 'app/keymaps';
import useStore from 'lib/store';

import {
  Container,
  Logo,
  LogoName,
  Shortcuts,
  ShortcutItem,
  ShortcutLabel,
  ShortcutKeys,
  Footer,
  Version,
} from './styles';
import { AlphaIcon } from 'lib/components/Icons';

const Watermark: React.FC = () => {
  const { context } = useStore();

  const opacity = Object.keys(context).length > 0 ? 0 : 1;

  return (
    <Container style={{ opacity }}>
      <Logo>
        <AlphaIcon />
        <LogoName>LPHA</LogoName>
      </Logo>
      <Shortcuts>
        <ShortcutItem>
          <ShortcutLabel>
            Press
            <ShortcutKeys>Ctrl+Shift+P</ShortcutKeys>
            to show all commands
          </ShortcutLabel>
        </ShortcutItem>
      </Shortcuts>
      <Footer $isVisible={Object.keys(context).length < 1}>
        <Version onClick={() => execCommand('terminal:debug')}>
          {app.getVersion()}
        </Version>
      </Footer>
    </Container>
  );
};

export default memo(Watermark);
