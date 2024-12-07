import { createElement, Fragment, h } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';

import { execCommand } from 'app/keymaps/commands';
import useStore from 'lib/store';

import { Overlay } from './styles';
import Profiles from './Profiles';
import Commands from './Commands';
import About from './About';
import Search from './Search';
import Form from './Profiles/Form';
import Dialog from './Profiles/Dialog';
import Warning from './Warning';
import ContextMenu from './ContextMenu';

const components = {
  Search,
  ContextMenu,
  overlayed: { Profiles, Commands, About, Form, Dialog, Warning },
};

const Modal: React.FC = () => {
  const { modal, setModal } = useStore();

  const [isVisible, setVisible] = useState<boolean>(false);

  const handleModal = (_?: any, modal?: string | null) =>
    new Promise<boolean>(resolve => {
      setVisible(false);

      execCommand('terminal:focus')
        .then(() => {
          setTimeout(() => setModal(null), 300);
        })
        .finally(() => {
          if (modal) setTimeout(() => setModal(modal), 300);
        });

      resolve(true);
    });

  const handleOverlay = (event: React.TargetedEvent<HTMLElement>) => {
    const { target, currentTarget } = event;

    target === currentTarget && handleModal();
  };

  useEffect(() => setVisible(Boolean(modal)), [modal]);

  const props: ModalProps = {
    modal,
    isVisible,
    setVisible,
    handleModal,
  };

  return modal ? (
    modal in components ? (
      createElement(components[modal], props)
    ) : (
      <Overlay $modal={modal} $isVisible={isVisible} onClick={handleOverlay}>
        {createElement(components.overlayed[modal], props)}
      </Overlay>
    )
  ) : (
    <Fragment />
  );
};

export default memo(Modal);
