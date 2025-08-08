import type { FontWeight, ITheme } from '@xterm/xterm';
import type { AuthenticationType, ConnectConfig } from 'ssh2';
import type IPCMain from 'shared/main';

declare global {
  type IRawSettings = Record<Lowercase<Section>, ISettings>;

  type ISettings = IAppOptions &
    IAppearanceOptions &
    ITerminalOptions &
    IWindowOptions;

  type IAppOptions = {
    autoUpdates: boolean;
    gpu: boolean;
    language: string;
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
  } & {
    allowProposedApi?: boolean;
    allowTransparency?: boolean;
  };

  type ITerminalOptions = {
    copyOnSelect: boolean;
    defaultProfile: string;
    focusOnHover: boolean;
    linkHandlerKey: 'ctrl' | 'shift' | 'alt' | 'meta' | false;
    openOnStart: boolean;
    preserveCWD: boolean;
    profiles: IProfile[];
    renderer: 'default' | 'webgl' | 'canvas';
    restoreOnStart: boolean;
    rightClick: 'contextmenu' | 'clipboard';
    scrollback: number;
    scrollOnUserInput: boolean;
    trimSelection: boolean;
    wordSeparators: string;
  };

  type IWindowOptions = {
    acrylic: boolean;
    alwaysOnTop: boolean;
    autoHideOnBlur: boolean;
    centerOnLaunch: boolean;
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
    args: string[];
    env: NodeJS.ProcessEnv;
    cwd?: string | null;
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

  type IPC = IPCMain;

  interface InstanceAttrs {
    profile: IProfile;
    origin?: string;
    id?: string;
  }

  var id: string | null;

  var menu: { top: number; left: number } | null;
}
