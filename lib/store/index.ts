import { create } from 'zustand';

import actions from './actions';
import methods from './methods';

const initialState: AlphaState = {
  context: {},
  options: {},
  profile: undefined,
  current: undefined,
  cols: undefined,
  rows: undefined,
  modal: undefined,
};

const useStore = create<AlphaStore>((set, getStore) => ({
  ...initialState,
  ...actions(set),
  ...methods(set, getStore),
}));

export default useStore;
