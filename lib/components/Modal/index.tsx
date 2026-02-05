import { createElement, Fragment } from 'preact';
import { memo, useEffect, useRef, useState } from 'preact/compat';

import { execCommand } from 'app/keymaps/commands';
import useStore from 'lib/store';

import styles from './styles.module.css';
import Profiles from './Profiles';
import Commands from './Commands';
import About from './About';
import Search from './Search';
import Warning from './Warning';
import TabContextMenu from './ContextMenu/Tab';
import TerminalContextMenu from './ContextMenu/Terminal';
import Rename from './ContextMenu/Tab/Rename';
import Form from './Profiles/Form';
import Dialog from './Dialog';
import Sync from './Sync';
import Workspace from './Workspace';
import History from './History';
import Keymaps from './Keymaps';

const components = {
  Search,
  TabContextMenu,
  TerminalContextMenu,
  overlayed: {
    Profiles,
    Commands,
    About,
    Form,
    Dialog,
    Warning,
    Sync,
    Rename,
    Workspace,
    History,
    Keymaps,
  },
};

const Modal: React.FC = () => {
  const store = useStore();

  const { modal, setModal } = store;

  const [isVisible, setVisible] = useState<boolean>(false);

  const offTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = (delay?: { on: number; off: number }) => {
    if (offTimeoutRef.current) {
      clearTimeout(offTimeoutRef.current);

      offTimeoutRef.current = null;
    }

    if (onTimeoutRef.current) {
      clearTimeout(onTimeoutRef.current);

      onTimeoutRef.current = null;
    }

    return { offDelay: delay?.off ?? 200, onDelay: delay?.on ?? 200 };
  };

  const handleModal = (
    _?: any,
    modal?: string | null,
    delay?: { on: number; off: number },
  ) => {
    setVisible(false);

    execCommand('terminal:focus', () => {
      const { offDelay, onDelay } = clearTimers(delay);

      offTimeoutRef.current = setTimeout(() => setModal(null), offDelay);

      if (modal) {
        onTimeoutRef.current = setTimeout(() => setModal(modal), onDelay);
      }
    });
  };

  const handleOverlay = (event: React.TargetedEvent<HTMLElement>) => {
    const { target, currentTarget } = event;

    target === currentTarget && handleModal();
  };

  useEffect(() => {
    setVisible(Boolean(modal));

    global.handleModal = handleModal;
  }, [modal]);

  useEffect(() => {
    const handleEscape = ({ key }: KeyboardEvent) =>
      key === 'Escape' && handleModal();

    window.addEventListener('keydown', handleEscape);

    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const props: ModalProps = {
    store,
    modal,
    isVisible,
    setVisible,
    handleModal,
  };

  const overlayClasses = [
    styles.overlay,
    isVisible ? styles.overlayVisible : styles.overlayHidden,
    modal === 'Keymaps' ? styles.overlayKeymaps : '',
  ].filter(Boolean).join(' ');

  return modal ? (
    modal in components ? (
      createElement(components[modal], props)
    ) : (
      <div className={overlayClasses} onClick={handleOverlay}>
        {createElement(components.overlayed[modal], props)}
      </div>
    )
  ) : (
    <Fragment />
  );
};

export default memo(Modal);
