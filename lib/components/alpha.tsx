import { Fragment, memo, useEffect } from 'preact/compat';

import useStore from 'lib/store';
import invokeEvents from 'lib/events';
import { Content } from 'lib/styles/global';
import { useFirstRun } from 'lib/utils/hooks';
import 'lib/i18n';

import Welcome from './Welcome';
import Modal from './Modal';
import Header from './Header';
import Terminal from './Terminal';
import Watermark from './Terminal/Watermark';

const Alpha: React.FC = () => {
  const { getStore, setModal } = useStore();

  const [isFirstRun, setIsFirstRun] = useFirstRun();

  useEffect(() => {
    if (!isFirstRun) invokeEvents(getStore);
  }, [isFirstRun]);

  return isFirstRun ? (
    <Welcome setIsFirstRun={setIsFirstRun} setModal={setModal} />
  ) : (
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
