import { EventEmitter } from 'events';
import { FontWeight, ITheme } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import { LigaturesAddon } from 'xterm-addon-ligatures';

declare global {
  var on: EventEmitter['on'];

  var emit: EventEmitter['emit'];

  var send: Electron.IpcRenderer['send'];

  var isWin: boolean;

  var isMac: boolean;

  type ISettings = IAppOptions & {
    cwd: string | null;
    useConpty: boolean;
  } & ITerminalOptions;

  type IRawSettings = Record<
    'application' | 'appearance' | 'command-line',
    ISettings
  >;

  type IAppOptions = {
    language: string;
    autoUpdates: boolean;
    alwaysOnTop: boolean;
    gpu: boolean;
  };

  type IProcessOptions = {
    id: string;
    cwd: string;
    shell: string;
    args: string[];
    env: {
      [key: string]: string;
    };
    useConpty: boolean;
  };

  type ITerminalOptions = {
    fontSize: number;
    fontFamily: string;
    fontWeight: FontWeight;
    fontLigatures: boolean;
    lineHeight: number;
    letterSpacing: number;
    cursorStyle: 'block' | 'underline' | 'bar';
    cursorBlink: boolean;
    theme: ITheme;
    scrollback?: number | undefined;
    allowProposedApi?: boolean | undefined;
    allowTransparency?: boolean | undefined;
  };

  type ITerminalAddons = {
    fitAddon: FitAddon;
    webLinksAddon: WebLinksAddon;
    unicode11Addon: Unicode11Addon;
    ligaturesAddon: LigaturesAddon | undefined;
  };

  type IProfile = {
    title: string;
    shell: string;
    args: string[];
  };

  type Commands = Record<string, () => void>;

  type IMenuCommand = Record<
    string,
    {
      keys: string[];
      onClick: () => void;
    }
  >;

  type ISettingsKey = Record<
    string,
    {
      label: string;
      type: 'input' | 'checkbox' | 'select';
      valueType: 'text' | 'number' | 'boolean';
      description: string;
      options?: any[] | undefined;
      range?:
        | {
            min?: number | undefined;
            max?: number | undefined;
          }
        | undefined;
    }
  >;
}

export {};
