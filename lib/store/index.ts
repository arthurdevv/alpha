import { create } from 'zustand';

import actions from './actions';
import methods from './methods';

const initialState: AlphaState = {
  context: {},
  processes: {},
  current: {
    origin: null,
    focused: '',
    instances: {},
  },
  options: {},
  viewport: {},
  modal: null,
  profile: null,
};

const useStore = create<AlphaStore>((set, getStore) => {
  const partial = <AlphaStore>{ ...initialState, getStore };

  const properties = Object.assign(actions(set), methods);

  Object.entries(properties).forEach(([key, value]) => {
    Object.defineProperty(partial, key, {
      configurable: false,
      writable: false,
      enumerable: true,
      value,
    });
  });

  return partial;
});

export default useStore;
