import type { FontWeight, ITheme as ITerminalTheme } from '@xterm/xterm';
import type { ISerialOptions, IShellOptions, ISSHOptions } from 'main/types';
import type { AlphaState, Section } from 'ui/types';

export type IProfile<T = 'shell' | 'ssh' | 'serial'> = {
  id: string;
  name: string;
  group: string;
  title: boolean;
  type: T;
} & (
  | { type: 'shell'; options: IShellOptions }
  | { type: 'ssh'; options: ISSHOptions }
  | { type: 'serial'; options: ISerialOptions }
);

export type IInstance = {
  id: string;
  title: string;
  isExpanded: boolean;
  isConnected: boolean;
  hasCustomTitle: boolean;
  profile: IProfile;
};

export type ISnapshot = {
  id: string;
  profile: IProfile;
};

export type ISession = Pick<AlphaState, 'context' | 'instances' | 'current'> & {
  snapshot: ISnapshot[];
  instances?: IInstance[];
};

export type IWorkspaceTab = {
  title: string;
  profile: string;
  commands: string[];
  overrideTitle: boolean;
};

export type IWorkspace = {
  id: string;
  name: string;
  tabs: IWorkspaceTab[];
};

export type IRawSettings = Record<Lowercase<Section>, ISettings>;

export type ISettings = IAppOptions &
  IAppearanceOptions &
  ITerminalOptions &
  IWindowOptions;

export type IAppOptions = {
  version: string;
  autoUpdates: boolean;
  enableAnalytics: boolean;
  language: 'auto' | 'en-US' | 'pt-BR' | 'es-ES' | 'fr-FR' | 'de-DE';
};

export type IAppearanceOptions = {
  cursorBlink: boolean;
  cursorStyle: 'block' | 'underline' | 'bar';
  drawBoldTextInBrightColors: boolean;
  fontFamily: string;
  fontLigatures: boolean;
  fontSize: number;
  fontWeight: FontWeight;
  fontWeightBold: FontWeight;
  letterSpacing: number;
  lineHeight: number;
  minimumContrastRatio: number;
  scrollback: number;
  theme: ITheme;
  preserveBackground: boolean;
  allowProposedApi?: boolean;
  allowTransparency?: boolean;
};

export type ITerminalOptions = {
  copyOnSelect: boolean;
  defaultProfile: string;
  focusOnHover: boolean;
  gitStatus: boolean;
  hideIndicators: boolean;
  indicatorsMode: 'always' | 'hover' | false;
  linkHandlerKey: 'ctrl' | 'shift' | 'alt' | 'meta' | false;
  openOnStart: boolean;
  preserveCWD: boolean;
  profiles: IProfile[];
  renderer: 'default' | 'webgl' | 'canvas';
  restoreOnStart: boolean;
  rightClick: 'contextmenu' | 'clipboard';
  scrollback: number;
  scrollOnUserInput: boolean;
  showTabs: 'single' | 'multiple' | 'hidden';
  trimSelection: boolean;
  wordSeparators: string;
  workspace: string;
  workspaces: IWorkspace[];
};

export type IWindowOptions = {
  acrylic: boolean;
  alwaysOnTop: boolean;
  autoHideOnBlur: boolean;
  centerOnLaunch: boolean;
  contextMenuStyle: 'minimal' | 'detailed';
  launchMode: 'default' | 'maximized' | 'fullscreen';
  newTabPosition: 'current' | 'end';
  opacity: number;
  onSecondInstance: 'create' | 'attach';
  tabWidth: 'auto' | 'fixed';
};

export type ITheme = ITerminalTheme & {
  name?: string;
};

export type IViewport = {
  cols: number;
  rows: number;
};

export type IGitInfo = {
  branch: string;
  modified: number;
  staged: number;
  untracked: number;
  ahead: number;
  behind: number;
  isRepo: boolean;
};

export type IAnalyticsConfig = {
  dsn: string;
  tracesSampleRate: number;
};

export type ErrorReporter = (
  process: 'Main' | 'Renderer',
  error: unknown,
  context?: string,
) => void;
