import { setCurrentTerminal, disposeTerminal } from './terminal';
import {
  TAB_SELECT,
  TAB_NEXT,
  TAB_PREVIOUS,
  TAB_SPECIFIC,
  TAB_CLOSE,
} from '../types/tab';
import { PROCESS_KILL } from '../types/process';
import { getIdContext } from '../selectors';

export function selectTab(id: string): (dispatch: AlphaDispatch) => void {
  return (dispatch: AlphaDispatch) => {
    dispatch({
      type: TAB_SELECT,
      id,
      callback() {
        dispatch(setCurrentTerminal(id));
      },
    });
  };
}

export function nextTab(): (
  dispatch: AlphaDispatch,
  getState: () => AlphaState,
) => void {
  return (dispatch: AlphaDispatch, getState: () => AlphaState) => {
    dispatch({
      type: TAB_NEXT,
      callback() {
        const state = getState();

        const { context, currentId, currentIndex } = getIdContext(state);

        const nextId = context[currentIndex + 1] || context[0];

        if (nextId || currentId !== nextId)
          dispatch(setCurrentTerminal(nextId));
      },
    });
  };
}

export function previousTab(): (
  dispatch: AlphaDispatch,
  getState: () => AlphaState,
) => void {
  return (dispatch: AlphaDispatch, getState: () => AlphaState) => {
    dispatch({
      type: TAB_PREVIOUS,
      callback() {
        const state = getState();

        const { context, currentId, currentIndex } = getIdContext(state);

        const previousId =
          context[currentIndex - 1] || context[context.length - 1];

        if (previousId || currentId !== previousId)
          dispatch(setCurrentTerminal(previousId));
      },
    });
  };
}

export function specificTab(
  index: number,
): (dispatch: AlphaDispatch, getState: () => AlphaState) => void {
  return (dispatch: AlphaDispatch, getState: () => AlphaState) => {
    const state = getState();

    if (index === 9) {
      const { context } = state.terminal;

      index = Object.keys(context).map(uid => context[uid]).length - 1;
    }

    dispatch({
      type: TAB_SPECIFIC,
      index,
      callback() {
        const { context } = getIdContext(state);

        const termId = context[index];

        if (termId) dispatch(setCurrentTerminal(termId));
      },
    });
  };
}

export function closeTab(id: string): (dispatch: AlphaDispatch) => void {
  return (dispatch: AlphaDispatch) => {
    dispatch({
      type: TAB_CLOSE,
      id,
      callback() {
        dispatch(disposeTerminal(id, PROCESS_KILL));
      },
    });
  };
}
