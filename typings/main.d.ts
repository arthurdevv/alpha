import type { ITheme as _ITheme, FontWeight } from '@xterm/xterm';
import type { AuthenticationType, ConnectConfig } from 'ssh2';
import type IPCMain from 'shared/ipc/main';

declare global {
  type IRawSettings = Record<Lowercase<Section>, ISettings>;

  type ISettings = IAppOptions &
    IAppearanceOptions &
    ITerminalOptions &
    IZenModeOptions &
    IWindowOptions;

  type IAppOptions = {
    version: string;
    autoUpdates: boolean;
    enableAnalytics: boolean;
    language: 'auto' | 'en-US' | 'pt-BR' | 'es-ES' | 'fr-FR' | 'de-DE';
  };

  type IAppearanceOptions = {
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
  } & {
    allowProposedApi?: boolean;
    allowTransparency?: boolean;
  };

  type ITerminalOptions = {
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

  type IWindowOptions = {
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

  type ISettingsOption = {
    name: string;
    label: string;
    type: 'string' | 'number' | 'boolean';
    input: 'text' | 'checkbox' | 'select';
    options?: (string | number)[];
    values?: (string | number | boolean)[];
    range?: {
      min: string;
      max: string;
      step: string;
    };
    badges?: string[];
  };

  type IShellOptions = {
    file: string;
    cwd: string;
    args: string[];
    env: Record<string, { value: string; hidden: boolean }>;
  };

  type ISerialOptions = {
    path: string;
    baudRate: number;
    dataBits: 5 | 6 | 7 | 8;
    stopBits: 1 | 1.5 | 2;
    parity: 'none' | 'even' | 'odd';
    rtscts: boolean;
    xon: boolean;
    xoff: boolean;
    xany: boolean;
    binding: any;
    scripts: IScript[];
    newlineMode: 'default' | 'lf' | 'cr' | 'crlf';
    inputBehavior: 'utf8' | 'line-by-line' | 'hex';
    outputBehavior: 'utf8' | 'hex';
  };

  type ISSHOptions = ConnectConfig & {
    host: string;
    port: number;
    authType: AuthenticationType;
    x11: boolean;
    messages: boolean;
    ports: IForwardPort[];
    scripts: IScript[];
    keyPath?: string;
  };

  type IForwardPort<T = 'local' | 'remote' | 'dynamic'> = {
    type: T;
  } & (
    | {
        type: 'local' | 'remote';
        host: string;
        port: number;
        dstHost: string;
        dstPort: number;
      }
    | {
        type: 'dynamic';
        host: string;
        port: number;
      }
  );

  type IScript = {
    execute: string;
  } & (
    | {
        type: 'exact';
        match: string;
      }
    | {
        type: 'regex';
        match: RegExp;
      }
  );

  type IProfile<T = 'shell' | 'ssh' | 'serial'> = {
    id: string;
    name: string;
    group: string;
    title: boolean;
  } & (
    | { type: 'shell'; options: IShellOptions }
    | { type: 'ssh'; options: ISSHOptions }
    | { type: 'serial'; options: ISerialOptions }
  ) & {
      type: T;
    };

  type ISnapshot = {
    id: string;
    profile: IProfile;
  };

  type ITheme = _ITheme & {
    name?: string;
  };

  type IWorkspace = {
    id: string;
    name: string;
    tabs: IWorkspaceTab[];
  };

  type IWorkspaceTab = {
    title: string;
    profile: string;
    commands: string[];
    overrideTitle: boolean;
  };

  type IAnalyticsConfig = {
    dsn: string;
    tracesSampleRate: number;
  };

  type ErrorReporter = (
    process: 'Main' | 'Renderer',
    error: unknown,
    context?: string,
  ) => void;

  type IPC = IPCMain;

  type IGitInfo = {
    branch: string;
    modified: number;
    staged: number;
    untracked: number;
    ahead: number;
    behind: number;
    isRepo: boolean;
  };

  interface InstanceArgs {
    profile: IProfile;
    origin?: string;
    id?: string;
    title?: string;
    commands?: string[];
    overrideTitle?: boolean;
  }

  interface CacheEntry {
    info: IGitInfo;
    timestamp: number;
  }

  interface StatusCounts {
    modified: number;
    staged: number;
    untracked: number;
  }

  interface AheadBehind {
    ahead: number;
    behind: number;
  }

  var id: string | null;

  var menu: { top: number; left: number } | null;

  var tabIndex: number;
}
