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
import { ActionItem, Actions, Container, DragRegion } from './styles';

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

  return (
    <Container
      onClick={() => execCommand('terminal:focus')}
      $preserveBackground={(theme as any) === 'default' || preserveBackground}
    >
      {!welcome && (
        <Fragment>
          <TabGroup />
          <Actions>
            <ActionItem onClick={() => execCommand('terminal:create', {})}>
              <PlusIcon />
              <Popover label="New terminal" />
            </ActionItem>
            <ActionItem onClick={() => execCommand('app:profiles')}>
              <ProfilesIcon />
              <Popover label="Profiles" />
            </ActionItem>
          </Actions>
        </Fragment>
      )}
      <DragRegion />
      <Actions>
        {!welcome && (
          <ActionItem onClick={() => execCommand('app:settings')}>
            <SettingsIcon />
            <Popover label="Settings" />
          </ActionItem>
        )}
        <ActionItem onClick={() => handleAction('minimize')}>
          <MinimizeIcon />
          <Popover label="Minimize" />
        </ActionItem>
        <ActionItem
          onClick={() => handleAction(isMaximized ? 'restore' : 'maximize')}
        >
          {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
          <Popover label={isMaximized ? 'Restore' : 'Maximize'} />
        </ActionItem>
        <ActionItem onClick={() => handleAction('close')}>
          <CloseIcon />
          <Popover label="Close" />
        </ActionItem>
      </Actions>
    </Container>
  );
};

export default memo(Header);
