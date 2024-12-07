import { h } from 'preact';
import React, { memo, useState } from 'preact/compat';

import { BrowserWindow } from '@electron/remote';
import { execCommand } from 'app/keymaps/commands';

import {
  CloseIcon,
  MaximizeIcon,
  MinimizeIcon,
  PlusIcon,
  ProfilesIcon,
  RestoreIcon,
  SettingsIcon,
} from 'lib/components/Icons';
import { ActionItem, Actions, Container, DragRegion } from './styles';
import TabGroup from './Tab';
import Popover from './Popover';

const Header: React.FC = () => {
  const [isMaximized, setMaximized] = useState<boolean>(false);

  const handleAction = (action: string) => {
    const focusedWindow = BrowserWindow.getFocusedWindow()!;

    switch (action) {
      case 'maximize':
      case 'restore':
        setMaximized(!isMaximized);
        break;

      case 'close':
        execCommand('app:save-session');
        break;
    }

    focusedWindow[action]();
  };

  return (
    <Container onClick={() => execCommand('terminal:focus')}>
      <TabGroup />
      <Actions>
        <ActionItem onClick={() => execCommand('terminal:create')}>
          <PlusIcon />
          <Popover label="New terminal" />
        </ActionItem>
        <ActionItem onClick={() => execCommand('app:profiles')}>
          <ProfilesIcon />
          <Popover label="Profiles" />
        </ActionItem>
      </Actions>
      <DragRegion />
      <Actions>
        <ActionItem onClick={() => execCommand('app:settings')}>
          <SettingsIcon />
          <Popover label="Settings" />
        </ActionItem>
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
