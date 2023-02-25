import { setCurrentProcess, killProcess } from './process';
import {
  TERMINAL_REQUEST,
  TERMINAL_RESIZE,
  TERMINAL_SET_CURRENT,
  TERMINAL_SET_OPTIONS,
  TERMINAL_DISPOSE,
} from '../types/terminal';
import { getIdContext, getTerminalById, getTerms } from '../selectors';

const getNextTargetId = (state: AlphaState, target: ITerminal): string => {
  const terms = getTerms(state);

  const index = terms.indexOf(target);

  const { currentId } = getIdContext(state);

  if (target.id === terms[terms.length - 1].id) {
    return terms[index - 1].id;
  }

  if (target.id === currentId) {
    return terms[terms.length - 1].id;
  }

  return currentId;
};

export function requestTerminal(
  current?: string | undefined,
  profile?: IProfile | undefined,
): (dispatch: AlphaDispatch, getState: () => AlphaState) => void {
  return (dispatch: AlphaDispatch, getState: () => AlphaState) => {
    dispatch({
      type: TERMINAL_REQUEST,
      callback() {
        const { process } = getState();

        global.emit('terminal-request', {
          current: current || process.current,
          profile,
        });
      },
    });
  };
}

export function resizeTerminal(
  id: string,
  cols: number,
  rows: number,
): (dispatch: AlphaDispatch) => void {
  return (dispatch: AlphaDispatch) => {
    dispatch({
      type: TERMINAL_RESIZE,
      id,
      cols,
      rows,
    });
  };
}

export function setCurrentTerminal(
  id: string,
): (dispatch: AlphaDispatch, getState: () => AlphaState) => void {
  return (dispatch: AlphaDispatch, getState: () => AlphaState) => {
    dispatch({
      type: TERMINAL_SET_CURRENT,
      id,
      callback() {
        const { terminal } = getState();

        const targetId = terminal.process[id];

        dispatch(setCurrentProcess(targetId));
      },
    });
  };
}

export function setTerminalOptions(options: ISettings) {
  return (dispatch: AlphaDispatch) => {
    dispatch({
      type: TERMINAL_SET_OPTIONS,
      options,
    });
  };
}

export function disposeTerminal(
  id: string | 'current',
  type: 'PROCESS_DELETE' | 'PROCESS_KILL',
): (dispatch: AlphaDispatch, getState: () => AlphaState) => void {
  return (dispatch: AlphaDispatch, getState: () => AlphaState) => {
    const state = getState();

    const { terminal } = state;

    if (type === 'PROCESS_KILL') {
      const targetId = id === 'current' ? terminal.current! : id;

      dispatch({
        type: TERMINAL_DISPOSE,
        id: targetId,
        callback() {
          const target = terminal.context[targetId];

          if (target.pid) {
            if (Object.keys(terminal.context).length <= 1) {
              return dispatch(killProcess(target.pid, type));
            }

            const nextTargetId = getNextTargetId(state, target);

            setTimeout(() => {
              dispatch(setCurrentTerminal(nextTargetId));
            }, 10);

            dispatch(killProcess(target.pid, type));
          }
        },
      });
    } else {
      const target = getTerminalById(id, terminal);

      if (!target) {
        return dispatch(killProcess(id, type));
      }

      dispatch({
        type: TERMINAL_DISPOSE,
        id: target.id,
        callback() {
          const currentId = terminal.process[terminal.current!];

          if (Object.keys(terminal.context).length > 1 && currentId !== id) {
            const nextTargetId = getNextTargetId(state, target);

            setTimeout(() => {
              dispatch(setCurrentTerminal(nextTargetId));
            }, 10);
          }

          dispatch(killProcess(id, type));
        },
      });
    }
  };
}
