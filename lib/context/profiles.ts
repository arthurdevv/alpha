import { connect } from 'react-redux';

import Profiles from 'lib/components/Profiles/group';
import { getRecent } from 'lib/store/selectors';
import {
  toggleProfiles,
  selectProfile,
  clearRecentProfiles,
} from 'lib/store/actions/profiles';

const mapStateToProps = (state: AlphaState) => ({
  recent: getRecent(state),
  isVisible: state.profiles.isVisible,
});

const mapDispatchToProps = (dispatch: AlphaDispatch) => ({
  toggleProfiles() {
    dispatch(toggleProfiles());
  },

  onSelect(profile: IProfile) {
    dispatch(selectProfile(profile));
  },

  clearRecent() {
    dispatch(clearRecentProfiles());
  },
});

export type ProfilesConnectedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Profiles);
