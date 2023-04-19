import { Immutable } from 'seamless-immutable';
import { Reducer, Store, ThunkDispatch } from '@reduxjs/toolkit';

import { WindowActions } from './store/types/window';
import { ProcessActions } from './store/types/process';
import { TerminalActions } from './store/types/terminal';
import { ProfilesActions } from './store/types/profiles';
import { TabActions } from './store/types/tab';

import { AlphaConnectedProps } from './context/alpha';
import { HeaderConnectedProps } from './context/header';
import { TerminalConnectedProps } from './context/terminal';
import { MenuConnectedProps } from './context/menu';

import theme from './styles/theme';

declare global {
  type AlphaProps = AlphaConnectedProps;

  type HeaderProps = HeaderConnectedProps;

  type TerminalProps = TerminalConnectedProps;

  type MenuProps = MenuConnectedProps;

  type ITab = {
    id: string;
    title: string;
    isCurrent: boolean;
  };

  type TabProps = {
    title: string;
    isCurrent: boolean;
    onSelect: () => void;
    onClose: () => void;
  };

  type TabGroupProps = {
    tabs: ITab[];
    onSelect: (id: string) => void;
    onClose: (id: string) => void;
  };

  type TermProps = {
    id: string;
    isDirty: boolean;
    isCurrent: boolean;
    onCurrent: () => void;
    onData: (data: string) => void;
    onTitle: (title: string) => void;
    onResize: (cols: number, rows: number) => void;
  } & ITerminalOptions;

  type ProfileProps = {
    title: string;
    shell: string;
    onSelect: () => void;
  };

  type ViewportProps = {
    cols: number | undefined;
    rows: number | undefined;
  };

  type PopoverProps = {
    label: string;
    style?: React.CSSProperties | undefined;
  };

  type AlphaStore = Store<AlphaState, AlphaActions> & {
    dispatch: ThunkDispatch<AlphaState, undefined, AlphaActions>;
  };

  type AlphaDispatch = AlphaStore['dispatch'];

  type AlphaReducer = Reducer<AlphaState, AlphaActions>;

  type AlphaState = {
    window: WindowState;
    process: ProcessState;
    terminal: TerminalState;
    profiles: ProfilesState;
  };

  type AlphaActions = (
    | WindowActions
    | ProcessActions
    | TerminalActions
    | ProfilesActions
    | TabActions
  ) & {
    callback?: () => void;
  };

  type WindowState = Immutable<{
    width: number;
    height: number;
    menu: MenuType;
    isMaximized: boolean;
    isFullScreen: boolean;
  }>;

  type MenuType = 'Profiles' | 'Commands' | 'Settings' | null;

  type ProcessState = Immutable<{
    context: Mutable<Record<string, IProcess>>;
    current: string | undefined;
  }>;

  type IProcess = Immutable<{
    id: string;
    title: string;
    shell: string | null;
    current?: string | undefined;
    isDirty: boolean;
  }>;

  type TerminalState = Immutable<
    {
      context: Mutable<Record<string, ITerminal>>;
      process: Record<string, string>;
      current: string | undefined;
      cols: number | undefined;
      rows: number | undefined;
    } & ITerminalOptions
  >;

  type ITerminal = Immutable<{
    id: string;
    pid: string | null;
  }>;

  type ProfilesState = Immutable<{
    recent: Mutable<Record<string, IProfile>>;
  }>;

  type Mutable<T> = T extends Immutable<infer U>
    ? Exclude<U, T> extends never
      ? U
      : Exclude<U, T>
    : T;
}

declare module 'styled-components' {
  type Theme = typeof theme;

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
