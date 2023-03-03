export const WINDOW_RESIZE = 'WINDOW_RESIZE';

export const WINDOW_MINIMIZE = 'WINDOW_MINIMIZE';

export const WINDOW_MAXIMIZE = 'WINDOW_MAXIMIZE';

export const WINDOW_RESTORE = 'WINDOW_RESTORE';

export const WINDOW_CLOSE = 'WINDOW_CLOSE';

export const WINDOW_TOGGLE_FULLSCREEN = 'WINDOW_TOGGLE_FULLSCREEN';

export const WINDOW_SET_MENU = 'WINDOW_SET_MENU';

export const WINDOW_EXEC_COMMAND = 'WINDOW_EXEC_COMMAND';

export interface WindowResizeAction {
  type: typeof WINDOW_RESIZE;
  width: number;
  height: number;
}

export interface WindowMinimizeAction {
  type: typeof WINDOW_MINIMIZE;
}

export interface WindowMaximizeAction {
  type: typeof WINDOW_MAXIMIZE;
}

export interface WindowRestoreAction {
  type: typeof WINDOW_RESTORE;
}

export interface WindowCloseAction {
  type: typeof WINDOW_CLOSE;
}

export interface WindowToggleFullScreenAction {
  type: typeof WINDOW_TOGGLE_FULLSCREEN;
}

export interface WindowSetMenuAction {
  type: typeof WINDOW_SET_MENU;
  menu: MenuType;
}

export interface WindowExecCommandAction {
  type: typeof WINDOW_EXEC_COMMAND;
  command: string;
}

export type WindowActions =
  | WindowResizeAction
  | WindowMinimizeAction
  | WindowMaximizeAction
  | WindowRestoreAction
  | WindowCloseAction
  | WindowToggleFullScreenAction
  | WindowSetMenuAction
  | WindowExecCommandAction;
