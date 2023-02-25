export const TERMINAL_REQUEST = 'TERMINAL_REQUEST';

export const TERMINAL_RESIZE = 'TERMINAL_RESIZE';

export const TERMINAL_SET_CURRENT = 'TERMINAL_SET_CURRENT';

export const TERMINAL_SET_OPTIONS = 'TERMINAL_SET_OPTIONS';

export const TERMINAL_DISPOSE = 'TERMINAL_DISPOSE';

export interface TerminalRequestAction {
  type: typeof TERMINAL_REQUEST;
}

export interface TerminalResizeAction {
  type: typeof TERMINAL_RESIZE;
  id: string;
  cols: number;
  rows: number;
}

export interface TerminalSetCurrentAction {
  type: typeof TERMINAL_SET_CURRENT;
  id: string;
}

export interface TerminalSetOptionsAction {
  type: typeof TERMINAL_SET_OPTIONS;
  options: ISettings;
}

export interface TerminalDisposeAction {
  type: typeof TERMINAL_DISPOSE;
  id: string;
}

export type TerminalActions =
  | TerminalRequestAction
  | TerminalResizeAction
  | TerminalSetCurrentAction
  | TerminalSetOptionsAction
  | TerminalDisposeAction;
