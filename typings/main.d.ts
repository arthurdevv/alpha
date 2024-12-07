import type { FontWeight, ITheme } from '@xterm/xterm';
import type IPCMain from 'shared/main';

declare global {
  type IRawSettings = Record<Lowercase<Section>, ISettings>;

  type ISettings = IAppOptions &
    IAppearanceOptions &
    ITerminalOptions &
    IWindowOptions;

  type IAppOptions = {
    language: string;
    autoUpdates: boolean;
    gpu: boolean;
  };

  type IAppearanceOptions = {
    fontSize: number;
    fontFamily: string;
    fontWeight: FontWeight;
    fontLigatures: boolean;
    fontWeightBold: FontWeight;
    drawBoldTextInBrightColors: boolean;
    lineHeight: number;
    letterSpacing: number;
    minimumContrastRatio: number;
    cursorStyle: 'block' | 'underline' | 'bar';
    cursorBlink: boolean;
    scrollback: number;
    theme: ITheme;
    allowProposedApi?: boolean;
    allowTransparency?: boolean;
  };

  type ITerminalOptions = {
    defaultProfile: string;
    renderer: 'default' | 'webgl' | 'canvas';
    scrollback: number;
    scrollOnUserInput: boolean;
    focusOnHover: boolean;
    rightClick: 'contextmenu' | 'clipboard';
    linkHandlerKey: 'ctrl' | 'shift' | 'alt' | 'meta' | false;
    preserveCWD: boolean;
    copyOnSelect: boolean;
    trimSelection: boolean;
    wordSeparators: string;
    openOnStart: boolean;
    restoreOnStart: boolean;
    profiles: IProfile[];
  };

  type IWindowOptions = {
    acrylic: boolean;
    opacity: number;
    alwaysOnTop: boolean;
    autoHideOnBlur: boolean;
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

  type IProcessOptions = {
    shell: string;
    args: string[];
    cwd?: string | null;
    env: NodeJS.ProcessEnv;
  };

  type IProfile = {
    id: string;
    name: string;
    group: string;
    title: boolean;
    options: IProcessOptions;
  };

  type IInstance = {
    id: string;
    options: IProcessOptions;
    profile: IProfile;
  };

  interface CreateProcessOptions {
    id?: string;
    source?: string;
    profile?: IProfile;
    options?: IProcessOptions;
  }

  type IPC = IPCMain;

  var id: string | null;

  var menu: { top: number; left: number } | null;
}
