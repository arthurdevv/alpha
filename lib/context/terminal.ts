import { connect } from 'react-redux';

import Terminal from 'lib/components/Terminal/group';
import { getTerms } from 'lib/store/selectors';
import { resizeTerminal } from 'lib/store/actions/terminal';
import {
  setProcessTitle,
  setCurrentProcess,
  sendProcessData,
} from 'lib/store/actions/process';

const mapStateToProps = (state: AlphaState) => ({
  terms: getTerms(state),
  process: state.process.context,
  current: state.process.current,
  cols: state.terminal.cols,
  rows: state.terminal.rows,
  fontSize: state.terminal.fontSize,
  fontFamily: state.terminal.fontFamily,
  fontWeight: state.terminal.fontWeight,
  fontLigatures: state.terminal.fontLigatures,
  lineHeight: state.terminal.lineHeight,
  letterSpacing: state.terminal.letterSpacing,
  cursorStyle: state.terminal.cursorStyle,
  cursorBlink: state.terminal.cursorBlink,
  theme: state.terminal.theme as ITerminalOptions['theme'],
});

const mapDispatchToProps = (dispatch: AlphaDispatch) => ({
  onCurrent(id: string) {
    dispatch(setCurrentProcess(id));
  },

  onData(id: string, data: string) {
    dispatch(sendProcessData(id, data));
  },

  onTitle(id: string, title: string) {
    dispatch(setProcessTitle(id, title));
  },

  onResize(id: string, cols: number, rows: number) {
    dispatch(resizeTerminal(id, cols, rows));
  },
});

export type TerminalConnectedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Terminal);
