import { h } from 'preact';
import React, { memo, useState } from 'preact/compat';

import { getCurrentWindow } from '@electron/remote';
import { execCommand } from 'app/keymaps';
import { saveBounds } from 'app/window/bounds';

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

  const handleWindow = ({ currentTarget }) => {
    const { ariaLabel } = currentTarget;

    const isMaximizeOrRestore = ['Maximize', 'Restore'].includes(ariaLabel);

    isMaximizeOrRestore
      ? setMaximized(!isMaximized)
      : execCommand('terminal:save').then(saveBounds);

    const currentWindow = getCurrentWindow();

    currentWindow[ariaLabel.toLowerCase()]();
  };

  return (
    <Container onClick={() => execCommand('terminal:focus')}>
      <TabGroup />
      <Actions>
        <ActionItem
          aria-label="New Terminal"
          onClick={() => execCommand('terminal:create')}
        >
          <PlusIcon />
          <Popover label="New Terminal" />
        </ActionItem>
        <ActionItem
          aria-label="Profiles"
          onClick={() => execCommand('terminal:profiles', true)}
        >
          <ProfilesIcon />
          <Popover label="Profiles" />
        </ActionItem>
      </Actions>
      <DragRegion />
      <Actions>
        <ActionItem
          aria-label="Settings"
          onClick={() => execCommand('terminal:settings')}
        >
          <SettingsIcon />
          <Popover label="Settings" />
        </ActionItem>
        <ActionItem aria-label="Minimize" onClick={handleWindow}>
          <MinimizeIcon />
          <Popover label="Minimize" />
        </ActionItem>
        <ActionItem
          aria-label={isMaximized ? 'Restore' : 'Maximize'}
          onClick={handleWindow}
        >
          {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
          <Popover label={isMaximized ? 'Restore' : 'Maximize'} />
        </ActionItem>
        <ActionItem aria-label="Close" onClick={handleWindow}>
          <CloseIcon />
          <Popover label="Close" />
        </ActionItem>
      </Actions>
    </Container>
  );
};

export default memo(Header);
