import Immutable from 'seamless-immutable';
import { v4 as uuidv4 } from 'uuid';
import {
  TERMINAL_RESIZE,
  TERMINAL_SET_OPTIONS,
  TERMINAL_DISPOSE,
} from '../types/terminal';
import { PROCESS_ADD, PROCESS_SET_CURRENT } from '../types/process';
import { getTerminalById } from '../selectors';

const defaultState: TerminalState = Immutable<Mutable<TerminalState>>({
  context: {},
  process: {},
  current: undefined,
  cols: undefined,
  rows: undefined,
  fontSize: 16,
  fontFamily: "Menlo, Consolas, 'Lucida Console', monospace",
  fontWeight: 400,
  fontLigatures: true,
  lineHeight: 1,
  letterSpacing: 0,
  cursorStyle: 'block',
  cursorBlink: true,
  theme: {
    foreground: '#E6E6E6',
    background: '#00000000',
    cursor: '#E6E6E6',
    cursorAccent: '#00000000',
    selectionForeground: '#E6E6E6',
    selectionBackground: '#FFFFFF26',
    black: '#000000',
    red: '#E06C75',
    green: '#98C379',
    yellow: '#E5C07B',
    blue: '#61AFEF',
    magenta: '#C678DD',
    cyan: '#56B6C2',
    white: '#E6E6E6',
    brightBlack: '#767676',
    brightRed: '#E06C75',
    brightGreen: '#98C379',
    brightYellow: '#E5C07B',
    brightBlue: '#61AFEF',
    brightMagenta: '#C678DD',
    brightCyan: '#56B6C2',
    brightWhite: '#E6E6E6',
  },
});

export default (state = defaultState, action: AlphaActions) => {
  switch (action.type) {
    case PROCESS_ADD: {
      const id = uuidv4();

      const terminal = Immutable({ id, pid: action.id });

      return state
        .setIn(['context', id], terminal)
        .setIn(['process', id], action.id)
        .set('current', id);
    }

    case PROCESS_SET_CURRENT: {
      if (action.id) {
        const target = getTerminalById(action.id, state)!;

        const current = state.context[target.id];

        return state
          .set('current', current.id)
          .setIn(['process', current.id], action.id);
      }

      return state.set('current', null);
    }

    case TERMINAL_RESIZE:
      return state.merge({ rows: action.rows, cols: action.cols });

    case TERMINAL_SET_OPTIONS: {
      const { options } = action;

      const constants = {
        foreground: state.theme.foreground,
        background: state.theme.background,
        cursor: state.theme.cursor,
        cursorAccent: state.theme.cursorAccent,
        selectionForeground: state.theme.selectionForeground,
        selectionBackground: state.theme.selectionBackground,
      };

      const mutableState: Immutable.DeepPartial<Mutable<TerminalState>> = {};

      Object.keys(options).forEach(key => {
        if (key === 'theme') {
          mutableState.theme = Object.assign(options.theme, constants);
        }

        mutableState[key] = options[key];
      });

      return state.merge(mutableState);
    }

    case TERMINAL_DISPOSE:
      return state
        .set('context', state.context.without(action.id))
        .set('process', state.process.without(action.id));
  }

  return state;
};
