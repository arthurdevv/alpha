import { h } from 'preact';
import { memo } from 'preact/compat';
import { useEffect } from 'preact/hooks';

import Mousetrap from 'mousetrap';
import useStore from 'lib/store';
import invokeEvents from 'lib/store/events';
import { keymaps, execCommand } from 'app/keymaps';
import { Content } from 'lib/styles/global';

import Header from './Header';
import Terminal from './Terminal';
import Watermark from './Watermark';
import Menu from './Menu';

const Alpha: React.FC = () => {
  const mousetrap: Mousetrap.MousetrapInstance = new (Mousetrap as any)(window);

  const { getState, setMenu } = useStore();

  useEffect(() => {
    mousetrap.stopCallback = () => false;

    Object.keys(keymaps).forEach(command => {
      const keys = keymaps[command];

      mousetrap.bind(
        keys,
        event => {
          event.preventDefault();

          execCommand(command);
        },
        'keydown',
      );
    });

    invokeEvents(getState, setMenu);

    return () => {
      mousetrap.reset();
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
