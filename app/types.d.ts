import type { EventEmitter } from 'events';
import { IPty } from 'node-pty';
import { FontWeight, ITheme } from 'xterm';

declare global {
  var [isWin, isMac]: boolean[];

  interface Window {
    on: EventEmitter['on'];

    emit: EventEmitter['emit'];

    send: Electron.IpcRenderer['send'];
  }

  type SettingsTag = 'application' | 'appearance' | 'terminal' | 'command-line';

  type IRawSettings = Record<SettingsTag, ISettings>;

  type ISettings = {
    language: string;
    autoUpdates: boolean;
    gpu: boolean;
    renderer: 'dom' | 'webgl' | 'canvas';
    copyOnSelect: boolean;
    openOnStart: boolean;
    cwd: string | null;
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
