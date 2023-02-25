import Immutable from 'seamless-immutable';
import {
  WINDOW_RESIZE,
  WINDOW_MAXIMIZE,
  WINDOW_RESTORE,
  WINDOW_TOGGLE_FULLSCREEN,
} from '../types/window';

const defaultState: WindowState = Immutable<Mutable<WindowState>>({
  width: 1050,
  height: 560,
  isMaximized: false,
  isFullScreen: false,
});

export default (state = defaultState, action: AlphaActions) => {
  switch (action.type) {
    case WINDOW_RESIZE:
      return state.set('width', action.width).set('height', action.height);

    case WINDOW_MAXIMIZE:
    case WINDOW_RESTORE:
      return state.set('isMaximized', !state.isMaximized);

    case WINDOW_TOGGLE_FULLSCREEN:
      return state.set('isFullScreen', !state.isFullScreen);
  }

  return state;
};
