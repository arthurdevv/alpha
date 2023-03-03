import { connect } from 'react-redux';

import Menu from 'lib/components/Menu';
import { getRecent } from 'lib/store/selectors';
import { setMenu } from 'lib/store/actions/window';
import { selectProfile, clearRecentProfiles } from 'lib/store/actions/profiles';

const mapStateToProps = (state: AlphaState) => ({
  menu: state.window.menu,
  recent: getRecent(state),
});

const mapDispatchToProps = (dispatch: AlphaDispatch) => ({
  setMenu(menu: MenuType) {
    dispatch(setMenu(menu));
  },

  selectProfile(profile: IProfile) {
    dispatch(selectProfile(profile));
  },

  clearRecent() {
    dispatch(clearRecentProfiles());
  },
});

export type MenuConnectedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
