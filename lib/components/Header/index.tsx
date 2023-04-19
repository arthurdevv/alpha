import { h } from 'preact';
import { memo } from 'preact/compat';

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

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { tabs, isMaximized, isFullScreen } = props;

  return global.isMac ? (
    <Container>
      <Actions>
        <MacWindowControl aria-label="Close" onClick={props.closeWindow}>
          <Popover label="Close" />
        </MacWindowControl>
        <MacWindowControl aria-label="Minimize" onClick={props.minimizeWindow}>
          <Popover label="Minimize" />
        </MacWindowControl>
        <MacWindowControl
          aria-label={isFullScreen ? 'Restore' : 'Maximize'}
          onClick={props.toggleFullScreen}
        >
          <Popover label={isFullScreen ? 'Restore' : 'Maximize'} />
        </MacWindowControl>
      </Actions>
      <TabGroup tabs={tabs} onSelect={props.onSelect} onClose={props.onClose} />
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
        <ActionItem
          aria-label="Settings"
          onClick={() => props.setMenu('Settings')}
        >
          <SettingsIcon />
          <Popover label="Settings" />
        </ActionItem>
      </Actions>
    </Container>
  ) : (
    <Container>
      <TabGroup tabs={tabs} onSelect={props.onSelect} onClose={props.onClose} />
      <Actions>
        <ActionItem
          aria-label="New Terminal"
          onClick={props.newTerminal}
          className={tabs.length > 0 ? 'visited' : ''}
        >
          <PlusIcon />
          <Popover label="New Terminal" />
        </ActionItem>
        <ActionItem
          aria-label="Profiles"
          onClick={() => props.setMenu('Profiles')}
          className={tabs.length > 0 ? 'visited' : ''}
        >
          <ProfilesIcon />
          <Popover label="Profiles" />
        </ActionItem>
      </Actions>
      <DragRegion />
      <Actions>
        <ActionItem
          aria-label="Settings"
          onClick={() => props.setMenu('Settings')}
        >
          <SettingsIcon />
          <Popover label="Settings" />
        </ActionItem>
        <ActionItem aria-label="Minimize" onClick={props.minimizeWindow}>
          <MinimizeIcon />
          <Popover label="Minimize" />
        </ActionItem>
        <ActionItem
          aria-label={isMaximized ? 'Restore' : 'Maximize'}
          onClick={isMaximized ? props.restoreWindow : props.maximizeWindow}
        >
          {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
          <Popover label={isMaximized ? 'Restore' : 'Maximize'} />
        </ActionItem>
        <ActionItem aria-label="Close" onClick={props.closeWindow}>
          <CloseIcon />
          <Popover label="Close" />
        </ActionItem>
      </Actions>
    </Container>
  );
};

export default memo(Header);
