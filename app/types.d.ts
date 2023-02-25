import { ImmutableArray } from 'seamless-immutable';
import { EventEmitter } from 'events';
import { FontWeight, ITheme } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import { LigaturesAddon } from 'xterm-addon-ligatures';

declare global {
  var on: EventEmitter['on'];

  var emit: EventEmitter['emit'];

  var send: typeof Electron.ipcRenderer.send;

  var isWin: boolean;

  var isMac: boolean;

  type ISettings = ITerminalOptions & {
    args: string[];
    env: Record<string, string>;
  };

  type IProcessOptions = {
    id: string;
    cwd: string;
    shell: string;
    args: string[];
    env: {
      [key: string]: string;
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
    theme: ITheme;
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
    args: string[] | ImmutableArray<string>;
  };

  type Commands = Record<string, () => void>;
}

export {};
