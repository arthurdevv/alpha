import Immutable from 'seamless-immutable';
import {
  PROFILES_SELECT,
  PROFILES_REMOVE,
  PROFILES_CLEAR_RECENT,
} from '../types/profiles';

const defaultState: ProfilesState = Immutable<Mutable<ProfilesState>>({
  recent: {},
});

export default (state = defaultState, action: AlphaActions) => {
  switch (action.type) {
    case PROFILES_SELECT:
      return state.setIn(['recent', action.profile.title], action.profile);

    case PROFILES_REMOVE:
      return state.set('recent', state.recent.without(action.profile.title));

    case PROFILES_CLEAR_RECENT:
      return state.set('recent', {});
  }

  return state;
};
