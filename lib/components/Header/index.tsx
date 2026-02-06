import { Fragment } from 'preact';
import React, { memo, useEffect, useState } from 'preact/compat';

import { BrowserWindow } from '@electron/remote';
import { execCommand } from 'app/keymaps/commands';
import { removeThemeVariables, setThemeVariables } from 'app/common/themes';
import useStore from 'lib/store';

import {
  CloseIcon,
  MaximizeIcon,
  MinimizeIcon,
  PlusIcon,
  ProfilesIcon,
  RestoreIcon,
  SettingsIcon,
} from 'lib/components/Icons';
import TabGroup from './Tab';
import Popover from './Popover';
import styles from './styles.module.css';

const Header: React.FC<{ welcome?: boolean }> = ({ welcome }) => {
  const {
    current: { origin },
    options: { theme, preserveBackground, acrylic },
  } = useStore();

  const [isMaximized, setMaximized] = useState<boolean>(false);

  const handleAction = (action: string) => {
    const focusedWindow = BrowserWindow.getFocusedWindow()!;

    if (['maximize', 'restore'].includes(action)) setMaximized(!isMaximized);

    focusedWindow[action]();
  };

  useEffect(() => {
    const focusedWindow = BrowserWindow.getFocusedWindow();

    if (focusedWindow) {
      ['maximize', 'unmaximize', 'restore', 'minimize'].forEach(eventName => {
        focusedWindow.on(eventName as any, () => {
          const isMaximized = focusedWindow.isMaximized();

          setMaximized(isMaximized);
        });
      });
    }
  }, []);

  useEffect(() => {
    if ((theme as any) === 'default') return;

    if (!origin || origin === 'Settings' || preserveBackground) {
      removeThemeVariables();
    } else {
      setThemeVariables(theme, { preserveBackground, acrylic } as ISettings);
    }
  }, [origin, preserveBackground]);

  const preserveBg = (theme as any) === 'default' || preserveBackground;
  const containerClasses = `${styles.container}${!preserveBg ? ` ${styles.containerWithBackground}` : ''}`;

  return (
    <div
      className={containerClasses}
      onClick={() => execCommand('terminal:focus')}
    >
      {!welcome && (
        <Fragment>
          <TabGroup />
          <div className={styles.actions}>
            <div className={styles.actionItem} onClick={() => execCommand('terminal:create', {})}>
              <PlusIcon />
              <Popover label="New terminal" />
            </div>
            <div className={styles.actionItem} onClick={() => execCommand('app:profiles')}>
              <ProfilesIcon />
              <Popover label="Profiles" />
            </div>
          </div>
        </Fragment>
      )}
      <div className={styles.dragRegion} />
      <div className={styles.actions}>
        {!welcome && (
          <div className={styles.actionItem} onClick={() => execCommand('app:settings')}>
            <SettingsIcon />
            <Popover label="Settings" />
          </div>
        )}
        <div className={styles.actionItem} onClick={() => handleAction('minimize')}>
          <MinimizeIcon />
          <Popover label="Minimize" />
        </div>
        <div
          className={styles.actionItem}
          onClick={() => handleAction(isMaximized ? 'restore' : 'maximize')}
        >
          {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
          <Popover label={isMaximized ? 'Restore' : 'Maximize'} />
        </div>
        <div className={styles.actionItem} onClick={() => handleAction('close')}>
          <CloseIcon />
          <Popover label="Close" />
        </div>
      </div>
    </div>
  );
};

export default memo(Header);
