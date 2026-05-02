import type { FontWeight } from '@xterm/xterm';

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

export interface Settings extends DataSettings {
  application: AppOptions;
  appearance: AppearanceSettings;
  terminal: TerminalSettings;
  window: WindowSettings;
}

export type FlatSettings = AppOptions &
  AppearanceSettings &
  TerminalSettings &
  WindowSettings &
  DataSettings;

export type SettingsFields = Omit<Settings, 'profiles' | 'workspaces'>;

interface DataSettings {
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

interface AppearanceSettings {
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

interface TerminalSettings extends IndicatorsSettings, ZenModeSettings {
  allowProposedApi?: boolean;
  allowTransparency?: boolean;
  copyOnSelect: boolean;
  defaultProfile: string;
  focusOnHover: boolean;
  linkHandlerKey: 'ctrl' | 'shift' | 'alt' | null;
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

interface WindowSettings {
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

interface IndicatorsSettings {
  gitStatus: boolean;
  indicatorsMode: 'always' | 'hover' | 'hidden';
}

interface ZenModeSettings {
  hideIndicators: boolean;
  showTabs: 'single' | 'multiple' | 'hidden';
}

export interface Theme {
  name: string;
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  purple: string;
  cyan: string;
  white: string;
  brightBlack: string;
  brightRed: string;
  brightGreen: string;
  brightYellow: string;
  brightBlue: string;
  brightPurple: string;
  brightCyan: string;
  brightWhite: string;
  background: string;
  foreground: string;
  cursorColor: string;
  selectionBackground: string;
}

export interface SystemInfo {
  username: string;
  hostname: string;
  homedir: string;
  root: string;
  uptime: string;
  resolution: string;
}

export interface BaseSetting {
  key: keyof FlatSettings;
  name: string;
  description: string;
  badges?: { label: string; type: 'info' | 'warning' | 'error' }[];
}

export interface GeneralSetting extends Omit<BaseSetting, 'key'> {
  input: 'text' | 'number' | 'range' | 'select' | 'segmented' | 'checkbox';
  options?: { label: string; value: string | number | null }[];
  range?: { min: number; max: number; step: number; type?: 'percentage' | 'number' };
}

interface TextSetting extends BaseSetting {
  input: 'text';
}

interface NumberSetting extends BaseSetting {
  input: 'number';
  range: { min: number; max: number; step: number };
}

interface RangeSetting extends BaseSetting {
  input: 'range';
  range: { min: number; max: number; step: number; type: 'percentage' | 'number' };
}

interface SelectSetting extends BaseSetting {
  input: 'select';
  options: { label: string; value: string | number | null }[];
  source?: string;
}

interface SegmentedSetting extends BaseSetting {
  input: 'segmented';
  options: { label: string; value: string | number | null }[];
}

interface CheckboxSetting extends BaseSetting {
  input: 'checkbox';
}

export type Setting =
  | TextSetting
  | NumberSetting
  | RangeSetting
  | SelectSetting
  | SegmentedSetting
  | CheckboxSetting;

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
    save: (value: FlatSettings) => void;
    reset: <S extends keyof SettingsFields>(scope: S, key: keyof SettingsFields[S]) => void;
  };

  keymaps: {
    load: () => Promise<Keymaps>;
    save: (value: Keymaps) => void;
    reset: (command: string) => void;
  };

  theme: {
    load: (name: string) => Promise<Partial<Theme>>;
    list: () => Promise<string[]>;
  };

  window: {
    action: (action: string, ...args: any[]) => void;
  };

  system: {
    info: () => Promise<SystemInfo>;
  };

  i18n: {
    getPreferredSystemLanguages: () => Promise<string[]>;
    loadTranslation: (lng: string) => Promise<Record<string, string>>;
  };
}
