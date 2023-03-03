import {
  PROFILES_SELECT,
  PROFILES_REMOVE,
  PROFILES_CLEAR_RECENT,
} from '../types/profiles';
import { setMenu } from './window';
import { getRecent } from '../selectors';

export function selectProfile(
  profile: IProfile,
): (dispatch: AlphaDispatch, getState: () => AlphaState) => void {
  return (dispatch: AlphaDispatch, getState: () => AlphaState) => {
    dispatch({
      type: PROFILES_SELECT,
      profile,
      callback() {
        global.emit('profile-select', { profile });

        const state = getState();

        const recent = getRecent(state);

        const target = state.profiles.recent[profile.title];

        if (recent.indexOf(target) === 3) {
          dispatch(removeProfile(recent[0]));
        }

        dispatch(setMenu(null));
      },
    });
  };
}

export function removeProfile(
  profile: IProfile,
): (dispatch: AlphaDispatch) => void {
  return (dispatch: AlphaDispatch) => {
    dispatch({
      type: PROFILES_REMOVE,
      profile,
    });
  };
}

export function clearRecentProfiles(): (dispatch: AlphaDispatch) => void {
  return (dispatch: AlphaDispatch) => {
    dispatch({
      type: PROFILES_CLEAR_RECENT,
      callback() {
        dispatch(setMenu(null));
      },
    });
  };
}
