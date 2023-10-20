import type { EventEmitter } from 'events';
import { FontWeight, ITheme } from 'xterm';
import { IPty } from 'node-pty';

declare global {
  var [isWin, isMac]: boolean[];

  interface Window {
    on: EventEmitter['on'];

    emit: EventEmitter['emit'];

    send: Electron.IpcRenderer['send'];
  }

  type SettingsTag =
    | 'application'
    | 'appearance'
    | 'keymaps'
    | 'terminal'
    | 'command-line';

  type IRawSettings = Record<SettingsTag, ISettings>;

  type ISettings = {
    language: string;
    autoUpdates: boolean;
    gpu: boolean;
    renderer: 'dom' | 'webgl' | 'canvas';
    copyOnSelect: boolean;
    openOnStart: boolean;
    shell: string;
    cwd: string | undefined;
    useConpty: boolean;
  } & ITerminalOptions;

  type ISettingsKey = {
    label: string;
    type: 'input' | 'checkbox' | 'select' | 'button';
    valueType: 'text' | 'number' | 'boolean' | 'void';
    description: string;
    options?: any[];
    range?: {
      min: number;
      max: number;
      step: number;
    };
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
    scrollback: number;
    theme: ITheme;
    allowProposedApi?: boolean;
    allowTransparency?: boolean;
  };

  type IProcessParam = {
    shell: string;
    args: string[];
  };

  type IProcessArgs = {
    process: IPty | null;
    shell: string | null;
  };

  type IProfile = {
    title: string;
    shell: string;
    args: string[];
  };
}
