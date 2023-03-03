import { h } from 'preact';
import { memo } from 'preact/compat';

import { app } from '@electron/remote';
import {
  Container,
  Logo,
  Shortcuts,
  ShortcutItem,
  ShortcutLabel,
  ShortcutKeys,
  Footer,
  Version,
} from './styles';
import { AlphaIcon } from '../Icon';

const Watermark: React.FC<{}> = () => (
  <Container>
    <Logo>
      <AlphaIcon />
      LPHA
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
    <Footer>
      <Version>{app.getVersion()}</Version>
    </Footer>
  </Container>
);

export default memo(Watermark);
