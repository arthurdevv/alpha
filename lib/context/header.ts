import { connect } from 'react-redux';

import Header from 'lib/components/Header';
import { getTabs } from 'lib/store/selectors';
import { requestTerminal } from 'lib/store/actions/terminal';
import { selectTab, closeTab } from 'lib/store/actions/tab';
import {
  setMenu,
  minimizeWindow,
  maximizeWindow,
  restoreWindow,
  closeWindow,
  toggleFullScreen,
} from 'lib/store/actions/window';

const mapStateToProps = (state: AlphaState) => ({
  tabs: getTabs(state),
  isMaximized: state.window.isMaximized,
  isFullScreen: state.window.isFullScreen,
});

const mapDispatchToProps = (dispatch: AlphaDispatch) => ({
  newTerminal() {
    dispatch(requestTerminal());
  },

  onSelect(id: string) {
    dispatch(selectTab(id));
  },

  onClose(id: string) {
    dispatch(closeTab(id));
  },

  setMenu(menu: MenuType) {
    dispatch(setMenu(menu));
  },

  minimizeWindow() {
    dispatch(minimizeWindow());
  },

  maximizeWindow() {
    dispatch(maximizeWindow());
  },

  restoreWindow() {
    dispatch(restoreWindow());
  },

  closeWindow() {
    dispatch(closeWindow());
  },

  toggleFullScreen() {
    dispatch(toggleFullScreen());
  },
});

export type HeaderConnectedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
