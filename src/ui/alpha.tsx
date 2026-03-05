import { Fragment, memo, useEffect, useState } from 'preact/compat';
import { unlink } from 'fs';

import { firstRunFlag, firstRunFlagPath } from 'app/settings/constants';
import useStore from 'lib/store';
import invokeEvents from 'lib/events';
import { Content } from 'lib/styles/global';
import 'lib/i18n';

import Welcome from './Welcome';
import Modal from './Modal';
import Header from './Header';
import Terminal from './Terminal';
import Watermark from './Terminal/Watermark';

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
