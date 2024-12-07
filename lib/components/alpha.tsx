import { Fragment, h } from 'preact';
import { memo, useEffect } from 'preact/compat';

import useStore from 'lib/store';
import invokeEvents from 'lib/events';
import { Content } from 'lib/styles/global';

import Modal from './Modal';
import Header from './Header';
import Terminal from './Terminal';
import Watermark from './Terminal/Watermark';

const Alpha: React.FC = () => {
  const store = useStore();

  useEffect(() => invokeEvents(store), []);

  return (
    <Fragment>
      <Content>
        <Header />
        <Content>
          <Watermark />
          <Terminal />
        </Content>
      </Content>
      <Modal />
    </Fragment>
  );
};

export default memo(Alpha);
