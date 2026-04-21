import { useEffect, useState } from 'preact/compat';

import { executeCommand } from 'ui/commands/registry';
import { useFormattedKeymaps } from 'ui/hooks/use-formatted-keymaps';

import {
  CloseIcon,
  MaximizeIcon,
  MinimizeIcon,
  PlusIcon,
  ProfilesIcon,
  RestoreIcon,
  SettingsIcon,
} from 'components/Icons/TitlebarIcons';
import Tabs from 'components/Titlebar/Tabs';
import Tooltip from 'components/Tooltip';

import { Action, Actions, Container, DragRegion } from './styles';

interface TitlebarProps {
  isFirstRun: boolean;
}

export default function Titlebar({ isFirstRun }: TitlebarProps) {
  const formattedKeymaps = useFormattedKeymaps();

  const [isMaximized, setMaximized] = useState<boolean>(false);

  useEffect(() => ipc.subscribe('window:state-changed', setMaximized), []);

  return (
    <Container onClick={() => executeCommand('terminal:focus')}>
      <Tabs />
      {!isFirstRun && (
        <Actions role="toolbar">
          <Tooltip label="New terminal" keys={formattedKeymaps['terminal:create']}>
            <Action onClick={() => executeCommand('terminal:create')}>
              <PlusIcon />
            </Action>
          </Tooltip>
          <Tooltip label="Profiles" keys={formattedKeymaps['app:profiles']}>
            <Action onClick={() => executeCommand('app:modal', 'Profiles')}>
              <ProfilesIcon />
            </Action>
          </Tooltip>
        </Actions>
      )}
      <DragRegion />
      <Actions role="toolbar">
        {!isFirstRun && (
          <Tooltip label="Settings" keys={formattedKeymaps['app:settings']}>
            <Action onClick={() => executeCommand('app:settings')}>
              <SettingsIcon />
            </Action>
          </Tooltip>
        )}
        <Tooltip label="Minimize">
          <Action onClick={() => ipc.window.action('minimize')}>
            <MinimizeIcon />
          </Action>
        </Tooltip>
        <Tooltip label={isMaximized ? 'Restore' : 'Maximize'}>
          <Action onClick={() => ipc.window.action(isMaximized ? 'restore' : 'maximize')}>
            {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
          </Action>
        </Tooltip>
        <Tooltip label="Close" keys={formattedKeymaps['window:close']}>
          <Action onClick={() => ipc.window.action('close')}>
            <CloseIcon />
          </Action>
        </Tooltip>
      </Actions>
    </Container>
  );
}
