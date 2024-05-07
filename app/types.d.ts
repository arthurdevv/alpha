import type { EventEmitter } from 'events';
import type { IPty } from 'node-pty';
import type { FontWeight, ITheme } from 'xterm';

declare global {
  interface Window {
    on(eventName: string, listener: (...args: any[]) => void): EventEmitter;
    emit(eventName: string, ...args: any[]): boolean;
    send(channel: string, ...args: any[]): void;
  }

  type IRawSettings = Record<Lowercase<Section>, ISettings>;

  type ISettings = IApplicationOptions &
    ITermOptions &
    ITerminalOptions &
    IWindowOptions;

  type IApplicationOptions = {
    language: string;
    autoUpdates: boolean;
    gpu: boolean;
  };

  type ITermOptions = {
    defaultProfile: string;
    renderer: 'dom' | 'webgl' | 'canvas';
    scrollback: number;
    scrollOnUserInput: boolean;
    copyOnSelect: boolean;
    wordSeparator: string;
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

  type IProcess = {
    shell: string;
    args: string[];
    cwd?: string;
    env: NodeJS.ProcessEnv;
  };

  type IProcessFork = { pty: IPty } & Omit<IProcess, 'env'>;

  type IProfile = {
    id: string;
    name: string;
    group: string;
    title: boolean;
    options: IProcess;
  };
}
