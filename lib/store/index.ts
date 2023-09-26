import { create } from 'zustand';

import actions from './actions';
import methods from './methods';

const initialState: AlphaState = {
  context: {},
  options: {},
  menu: undefined,
  cols: undefined,
  rows: undefined,
  current: undefined,
};

const useStore = create<AlphaStore>((set, getState) => ({
  ...initialState,
  ...actions(set),
  ...methods(set, getState),
}));

export default useStore;
