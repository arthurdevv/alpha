import type { FontWeight, ITheme as ITerminalTheme } from '@xterm/xterm';

import type { SerialOptions, ShellOptions, SSHOptions } from 'main/types';

declare global {
  var ipc: IpcAPI;
  type UUID = `${string}-${string}-${string}-${string}-${string}`;
}

export interface Instance {
  id: UUID;
  title: string;
  profile: Profile;
  isExpanded: boolean;
  isConnected: boolean;
  hasCustomTitle: boolean;
}

interface BaseProfile {
  id: UUID;
  name: string;
  group: string;
  useNameAsTitle: boolean;
}

export interface ShellProfile extends BaseProfile {
  type: 'shell';
  options: ShellOptions;
}

export interface SerialProfile extends BaseProfile {
  type: 'serial';
  options: SerialOptions;
}

export interface SSHProfile extends BaseProfile {
  type: 'ssh';
  options: SSHOptions;
}

export type Profile = ShellProfile | SerialProfile | SSHProfile;

export interface Workspace {
  id: UUID;
  name: string;
  tabs: WorkspaceTab[];
}

export interface WorkspaceTab {
  title: string;
  profile: string;
  commands: string[];
  overrideTitle: boolean;
}

export interface Viewport {
  cols: number | null;
  rows: number | null;
}

export interface GitInfo {
  branch: string;
  modified: number;
  staged: number;
  untracked: number;
  ahead: number;
  behind: number;
  isRepo: boolean;
}

export interface AnalyticsConfig {
  dsn: string;
  tracesSampleRate: number;
}

export interface Settings extends DataOptions {
  application: AppOptions;
  appearance: AppearanceOptions;
  terminal: TerminalOptions;
  window: WindowOptions;
}

export type FlatSettings = AppOptions &
  AppearanceOptions &
  TerminalOptions &
  WindowOptions &
  DataOptions;

export type SettingsFields = Omit<Settings, 'profiles' | 'workspaces'>;

interface DataOptions {
  profiles: Profile[];
  workspaces: Workspace[];
}

interface AppOptions {
  version: string;
  autoUpdates: boolean;
  enableAnalytics: boolean;
  language:
    | 'auto'
    | 'de-DE'
    | 'en-US'
    | 'es-ES'
    | 'fr-FR'
    | 'ja-JP'
    | 'ko-KR'
    | 'pt-BR'
    | 'ru-RU'
    | 'zh-CN';
}

interface AppearanceOptions {
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
  theme: string;
  preserveBackground: boolean;
}

interface TerminalOptions extends IndicatorsOptions, ZenModeOptions {
  allowProposedApi?: boolean;
  allowTransparency?: boolean;
  copyOnSelect: boolean;
  defaultProfile: string;
  focusOnHover: boolean;
  linkHandlerKey: 'ctrl' | 'shift' | 'alt' | 'meta' | null;
  openOnStart: boolean;
  preserveCWD: boolean;
  renderer: 'dom' | 'webgl' | 'canvas';
  restoreOnStart: boolean;
  rightClick: 'contextmenu' | 'clipboard' | null;
  scrollback: number;
  scrollOnUserInput: boolean;
  trimSelection: boolean;
  wordSeparators: string;
  workspace: string | null;
}

interface WindowOptions {
  acrylic: boolean;
  alwaysOnTop: boolean;
  autoHideOnBlur: boolean;
  centerOnLaunch: boolean;
  contextMenuStyle: 'minimal' | 'detailed';
  launchMode: 'default' | 'maximized' | 'fullscreen';
  newTabPosition: 'after-current' | 'end';
  opacity: number;
  onSecondInstance: 'new-window' | 'attach';
  tabWidth: 'auto' | 'fixed';
}

interface IndicatorsOptions {
  gitStatus: boolean;
  indicatorsMode: 'always' | 'hover' | 'hidden';
}

interface ZenModeOptions {
  hideIndicators: boolean;
  showTabs: 'single' | 'multiple' | 'hidden';
}

export interface Theme extends ITerminalTheme {
  name?: string;
}

interface BaseOption {
  name: string;
  label: string;
  badges?: string[];
}

interface TextOption extends BaseOption {
  type: 'string';
  input: 'text';
}

interface NumberOption extends BaseOption {
  type: 'number';
  input: 'text';
  range: { min: number; max: number; step: number };
}

interface CheckboxOption extends BaseOption {
  type: 'boolean';
  input: 'checkbox';
}

interface SelectorOption<
  T extends string | number = string | number,
> extends BaseOption {
  type: 'string' | 'number';
  input: 'selector';
  options: T[];
  values: (T | null)[];
}

export type SettingsOption =
  | TextOption
  | NumberOption
  | CheckboxOption
  | SelectorOption;

export type Keymaps = Record<string, string[]>;

export type Combos = Record<string, string>;

export type ErrorReporter = (
  process: 'Main' | 'Renderer',
  error: unknown,
  context?: string,
) => void;

export interface IpcAPI {
  subscribe(event: string, callback: (...args: any[]) => void): () => void;

  app: {
    version: string;
    isPackaged: () => Promise<boolean>;
  };

  settings: {
    load: () => Promise<Settings>;
    get: () => Promise<FlatSettings>;
    pick: <T extends keyof FlatSettings>(key: T) => Promise<FlatSettings[T]>;
    save: (value: Settings) => void;
    reset: <S extends keyof SettingsFields>(
      scope: S,
      key: keyof SettingsFields[S],
    ) => void;
  };

  keymaps: {
    load: () => Promise<Keymaps>;
    save: (value: Keymaps) => void;
    reset: (command: string) => void;
  };

  window: {
    action: (action: string, ...args: any[]) => void;
  };

  i18n: {
    getPreferredSystemLanguages: () => Promise<string[]>;
    loadTranslation: (lng: string) => Promise<Record<string, string>>;
  };
}
