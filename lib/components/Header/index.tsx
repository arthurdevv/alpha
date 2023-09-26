import { h } from 'preact';
import React, { memo, useState } from 'preact/compat';

import { getCurrentWindow } from '@electron/remote';
import { execCommand } from 'app/keymaps';
import useStore from 'lib/store';

import { Container, DragRegion, Actions, ActionItem } from './styles';
import {
  PlusIcon,
  ProfilesIcon,
  SettingsIcon,
  MinimizeIcon,
  MaximizeIcon,
  RestoreIcon,
  CloseIcon,
} from '../Icon';
import TabGroup from './Tab';
import Popover from './Popover';

const Header: React.FC = () => {
  const { context } = useStore();

  const [isMaximized, setMaximized] = useState<boolean>(false);

  const handleWindow = (event: React.TargetedEvent<any>) => {
    const { ariaLabel } = event.currentTarget;

    const currentWindow = getCurrentWindow();

    currentWindow[ariaLabel.toLowerCase()]();

    if (ariaLabel === 'Maximize' || ariaLabel === 'Restore') {
      setMaximized(!isMaximized);
    }
  };

  return (
    <Container onClick={() => execCommand('terminal:focus')}>
      <TabGroup />
      <Actions>
        <ActionItem
          className={Object.keys(context).length >= 1 && 'visited'}
          aria-label="New Terminal"
          onClick={() => execCommand('terminal:create')}
        >
          <PlusIcon />
          <Popover label="New Terminal" />
        </ActionItem>
        <ActionItem
          aria-label="Profiles"
          onClick={() => execCommand('terminal:profiles')}
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
