export const PROFILES_SELECT = 'PROFILES_SELECT';

export const PROFILES_REMOVE = 'PROFILES_REMOVE';

export const PROFILES_CLEAR_RECENT = 'PROFILES_CLEAR_RECENT';

interface ProfilesSelectAction {
  type: typeof PROFILES_SELECT;
  profile: IProfile;
}

interface ProfilesRemoveAction {
  type: typeof PROFILES_REMOVE;
  profile: IProfile;
}

interface ProfilesClearRecentAction {
  type: typeof PROFILES_CLEAR_RECENT;
}

export type ProfilesActions =
  | ProfilesSelectAction
  | ProfilesRemoveAction
  | ProfilesClearRecentAction;
