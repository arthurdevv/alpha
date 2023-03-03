import { h } from 'preact';
import { memo } from 'preact/compat';
import { useEffect } from 'preact/hooks';

import Mousetrap from 'mousetrap';
import { commands } from 'app/common/keymaps/commands';
import { getKeymapsParsed } from 'app/common/keymaps';

import { Content } from 'lib/styles/global';
import Menu from 'lib/context/menu';
import Header from 'lib/context/header';
import Terminal from 'lib/context/terminal';
import Watermark from './Watermark';

const Alpha: React.FC<AlphaProps> = (props: AlphaProps) => {
  const mousetrap: Mousetrap.MousetrapInstance = new (Mousetrap as any)(window);

  useEffect(() => {
    mousetrap.stopCallback = () => false;

    const keymaps = getKeymapsParsed();

    Object.keys(keymaps).forEach(command => {
      const keys = keymaps[command];

      mousetrap.bind(
        keys,
        event => {
          event.preventDefault();

          const callback = commands[command];

          props.execCommand(command, callback, event);
        },
        'keydown',
      );
    });

    const handleResize = () => {
      props.resizeWindow(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      mousetrap.reset();

      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Content>
      <Header />
      <Content>
        <Terminal />
        <Watermark />
      </Content>
      <Menu />
    </Content>
  );
};

export default memo(Alpha);
