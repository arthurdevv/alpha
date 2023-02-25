import { h } from 'preact';
import { memo } from 'preact/compat';
import { useEffect } from 'preact/hooks';

import Mousetrap from 'mousetrap';
import { commands } from 'app/common/keymaps/commands';
import { getKeymapsParsed } from 'app/common/keymaps';

import Header from 'lib/context/header';
import Terminal from 'lib/context/terminal';
import Profiles from 'lib/context/profiles';
import { Content } from 'lib/styles/global';

const Alpha: React.FC<AlphaProps> = (props: AlphaProps) => {
  const { resizeWindow, execCommand } = props;

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

          execCommand(command, callback, event);
        },
        'keydown',
      );
    });

    const handleResize = () => {
      resizeWindow(window.innerWidth, window.innerHeight);
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
      </Content>
      <Profiles />
    </Content>
  );
};

export default memo(Alpha);
