import {
  WINDOW_RESIZE,
  WINDOW_MINIMIZE,
  WINDOW_MAXIMIZE,
  WINDOW_RESTORE,
  WINDOW_CLOSE,
  WINDOW_TOGGLE_FULLSCREEN,
  WINDOW_SET_MENU,
  WINDOW_EXEC_COMMAND,
} from '../types/window';

export function resizeWindow(
  width: number,
  height: number,
): (dispatch: AlphaDispatch) => void {
  return (dispatch: AlphaDispatch) => {
    dispatch({
      type: WINDOW_RESIZE,
      width,
      height,
    });
  };
}

export function minimizeWindow(): (dispatch: AlphaDispatch) => void {
  return (dispatch: AlphaDispatch) => {
    dispatch({
      type: WINDOW_MINIMIZE,
      callback() {
        global.send('window-minimize');
      },
    });
  };
}

export function maximizeWindow(): (dispatch: AlphaDispatch) => void {
  return (dispatch: AlphaDispatch) => {
    dispatch({
      type: WINDOW_MAXIMIZE,
      callback() {
        global.send('window-maximize');
      },
    });
  };
}

export function restoreWindow(): (dispatch: AlphaDispatch) => void {
  return (dispatch: AlphaDispatch) => {
    dispatch({
      type: WINDOW_RESTORE,
      callback() {
        global.send('window-restore');
      },
    });
  };
}

export function closeWindow(): (dispatch: AlphaDispatch) => void {
  return (dispatch: AlphaDispatch) => {
    dispatch({
      type: WINDOW_CLOSE,
      callback() {
        global.send('window-close');
      },
    });
  };
}

export function toggleFullScreen(): (dispatch: AlphaDispatch) => void {
  return (dispatch: AlphaDispatch) => {
    dispatch({
      type: WINDOW_TOGGLE_FULLSCREEN,
      callback() {
        global.send('window-toggle-fullscreen');
      },
    });
  };
}

export function setMenu(menu: MenuType): (dispatch: AlphaDispatch) => void {
  return (dispatch: AlphaDispatch) => {
    dispatch({
      type: WINDOW_SET_MENU,
      menu,
    });
  };
}

export function execCommand(
  command: string,
  callback: (event: any, dispatch: AlphaDispatch) => void,
  event: any,
): (dispatch: AlphaDispatch) => void {
  return (dispatch: AlphaDispatch) => {
    dispatch({
      type: WINDOW_EXEC_COMMAND,
      command,
      callback() {
        if (callback) {
          callback(event, dispatch);
        } else {
          global.emit('exec-command', command);
        }
      },
    });
  };
}
