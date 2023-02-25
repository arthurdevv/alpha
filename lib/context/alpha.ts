import { connect } from 'react-redux';

import Alpha from 'lib/components/alpha';
import { resizeWindow, execCommand } from 'lib/store/actions/window';

const mapStateToProps = (state: AlphaState) => ({
  width: state.window.width,
  height: state.window.height,
});

const mapDispatchToProps = (dispatch: AlphaDispatch) => ({
  resizeWindow(width: number, height: number) {
    dispatch(resizeWindow(width, height));
  },

  execCommand(
    command: string,
    callback: (event: any, dispatch: AlphaDispatch) => void,
    event: any,
  ) {
    dispatch(execCommand(command, callback, event));
  },
});

export type AlphaConnectedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Alpha);
