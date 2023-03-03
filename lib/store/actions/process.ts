import {
  PROCESS_ADD,
  PROCESS_SET_TITLE,
  PROCESS_SET_CURRENT,
  PROCESS_SET_DATA,
  PROCESS_SEND_DATA,
  PROCESS_CLEAR_DATA,
  PROCESS_DELETE,
  PROCESS_KILL,
} from '../types/process';

export function addProcess(
  id: string,
  shell: string,
  current?: string | undefined,
): (dispatch: AlphaDispatch, getState: () => AlphaState) => void {
  return (dispatch: AlphaDispatch, getState: () => AlphaState) => {
    const { process } = getState();

    dispatch({
      type: PROCESS_ADD,
      id,
      shell,
      current: current || process.current,
    });
  };
}

export function setProcessTitle(id: string, title: string): AlphaActions {
  return {
    type: PROCESS_SET_TITLE,
    id,
    title,
  };
}

export function setCurrentProcess(
  id: string,
): (dispatch: AlphaDispatch) => void {
  return (dispatch: AlphaDispatch) => {
    dispatch({
      type: PROCESS_SET_CURRENT,
      id,
    });
  };
}

export function setProcessData(
  id: string,
  data: string,
): (dispatch: AlphaDispatch) => void {
  return (dispatch: AlphaDispatch) => {
    dispatch({
      type: PROCESS_SET_DATA,
      id,
      data,
    });
  };
}

export function sendProcessData(
  id: string | null,
  data: string,
): (dispatch: AlphaDispatch, getState: () => AlphaState) => void {
  return (dispatch: AlphaDispatch, getState: () => AlphaState) => {
    dispatch({
      type: PROCESS_SEND_DATA,
      id,
      callback() {
        const { process } = getState();

        global.emit('process-send-data', {
          id: id || process.current,
          data,
        });
      },
    });
  };
}

export function clearProcessData(): AlphaActions {
  return {
    type: PROCESS_CLEAR_DATA,
  };
}

export function killProcess(
  id: string,
  type: typeof PROCESS_DELETE | typeof PROCESS_KILL,
): (dispatch: AlphaDispatch) => void {
  return (dispatch: AlphaDispatch) => {
    dispatch({
      type,
      id,
      callback() {
        if (type === PROCESS_KILL) {
          global.emit('process-kill', { id });
        }
      },
    });
  };
}
