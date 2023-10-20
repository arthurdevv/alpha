import { h } from 'preact';
import { memo } from 'preact/compat';
import { useEffect } from 'preact/hooks';

import useStore from 'lib/store';
import invokeEvents from 'lib/store/events';
import { Content } from 'lib/styles/global';

import Menu from './Menu';
import Header from './Header';
import Terminal from './Terminal';
import Watermark from './Watermark';

const Alpha: React.FC = () => {
  const store = useStore();

  useEffect(() => invokeEvents(store), []);

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
