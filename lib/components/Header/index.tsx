import { h } from 'preact';
import { memo } from 'preact/compat';

import { openSettings } from 'app/settings';
import {
  Container,
  DragRegion,
  Actions,
  ActionItem,
  MacWindowControl,
} from './styles';
import {
  PlusIcon,
  ProfilesIcon,
  SettingsIcon,
  MinimizeIcon,
  MaximizeIcon,
  RestoreIcon,
  CloseIcon,
} from '../Icon';
import Popover from './Popover';
import TabGroup from './Tab/group';

const Header: React.FC<HeaderProps> = (props: HeaderProps) =>
  global.isMac ? (
    <Container>
      <Actions>
        <MacWindowControl aria-label="Close" onClick={props.closeWindow}>
          <Popover label="Close" />
        </MacWindowControl>
        <MacWindowControl aria-label="Minimize" onClick={props.minimizeWindow}>
          <Popover label="Minimize" />
        </MacWindowControl>
        <MacWindowControl
          aria-label={props.isFullScreen ? 'Restore' : 'Maximize'}
          onClick={props.toggleFullScreen}
        >
          <Popover label={props.isFullScreen ? 'Restore' : 'Maximize'} />
        </MacWindowControl>
      </Actions>
      <TabGroup
        tabs={props.tabs}
        onSelect={props.onSelect}
        onClose={props.onClose}
      />
      <Actions>
        <ActionItem aria-label="New Terminal" onClick={props.newTerminal}>
          <PlusIcon />
          <Popover label="New Terminal" />
        </ActionItem>
        <ActionItem
          aria-label="Profiles"
          onClick={() => props.setMenu('Profiles')}
        >
          <ProfilesIcon />
          <Popover label="Profiles" />
        </ActionItem>
      </Actions>
      <DragRegion />
      <Actions>
        <ActionItem aria-label="Settings" onClick={openSettings}>
          <SettingsIcon />
          <Popover label="Settings" />
        </ActionItem>
      </Actions>
    </Container>
  ) : (
    <Container>
      <TabGroup
        tabs={props.tabs}
        onSelect={props.onSelect}
        onClose={props.onClose}
      />
      <Actions>
        <ActionItem
          aria-label="New Terminal"
          onClick={props.newTerminal}
          className={props.tabs.length > 0 ? 'visited' : ''}
        >
          <PlusIcon />
          <Popover label="New Terminal" />
        </ActionItem>
        <ActionItem
          aria-label="Profiles"
          onClick={() => props.setMenu('Profiles')}
          className={props.tabs.length > 0 ? 'visited' : ''}
        >
          <ProfilesIcon />
          <Popover label="Profiles" />
        </ActionItem>
      </Actions>
      <DragRegion />
      <Actions>
        <ActionItem aria-label="Settings" onClick={openSettings}>
          <SettingsIcon />
          <Popover label="Settings" />
        </ActionItem>
        <ActionItem aria-label="Minimize" onClick={props.minimizeWindow}>
          <MinimizeIcon />
          <Popover label="Minimize" />
        </ActionItem>
        <ActionItem
          aria-label={props.isMaximized ? 'Restore' : 'Maximize'}
          onClick={
            props.isMaximized ? props.restoreWindow : props.maximizeWindow
          }
        >
          {props.isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
          <Popover label={props.isMaximized ? 'Restore' : 'Maximize'} />
        </ActionItem>
        <ActionItem aria-label="Close" onClick={props.closeWindow}>
          <CloseIcon />
          <Popover label="Close" />
        </ActionItem>
      </Actions>
    </Container>
  );

export default memo(Header);
