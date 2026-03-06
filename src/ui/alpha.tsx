import { unlink } from 'fs';

import { Fragment, memo, useEffect, useState } from 'preact/compat';

import { firstRunFlag, firstRunFlagPath } from 'main/settings/constants';
import invokeEvents from 'ui/ipc/events';
import useStore from 'ui/store';
import { Content } from 'ui/styles/global';
import 'ui/i18n';

import Header from './components/Header';
import Modal from './components/Modal';
import Terminal from './components/Terminal';
import Watermark from './components/Watermark';
import Welcome from './components/Welcome';

const Alpha: React.FC = () => {
  const { getStore, setModal } = useStore();

  const [isFirstRun, setIsFirstRun] = useState(firstRunFlag);

  useEffect(() => {
    if (!isFirstRun) return invokeEvents(getStore);

    unlink(firstRunFlagPath, error => error && reportError(error));
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
