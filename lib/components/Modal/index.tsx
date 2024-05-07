import { createElement, Fragment, h } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';

import { execCommand } from 'app/keymaps';
import useStore from 'lib/store';

import { Overlay } from './styles';
import Debug from './Debug';
import Search from './Search';
import Commands from './Commands';
import Profiles from './Profiles';
import Form from './Profiles/Form';
import Dialog from './Profiles/Dialog';

const Modal: React.FC = () => {
  const { modal, setModal } = useStore();

  const [isVisible, setVisible] = useState<boolean>(false);

  const handleModal = (_?: any, modal?: string | undefined) =>
    new Promise<boolean>(resolve => {
      setVisible(false);

      execCommand('terminal:focus')
        .then(() => {
          setTimeout(() => setModal(undefined), 300);
        })
        .finally(() => {
          if (modal) {
            setTimeout(() => setModal(modal), 300);
          }
        });

      resolve(true);
    });

  const handleOverlay = (event: React.TargetedEvent<HTMLElement>) => {
    const { target, currentTarget } = event;

    target === currentTarget && handleModal();
  };

  useEffect(() => setVisible(Boolean(modal)), [modal]);

  return modal ? (
    modal === 'Search' ? (
      <Search isVisible={isVisible} onClose={handleModal} />
    ) : (
      <Overlay $isVisible={isVisible} onClick={handleOverlay}>
        {createElement({ Profiles, Commands, Debug, Form, Dialog }[modal]!, {
          isVisible,
          modal,
          handleModal,
        })}
      </Overlay>
    )
  ) : (
    <Fragment />
  );
};

export default memo(Modal);
