import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createAppActions } from './actions';
import type { AppState, AppStore } from './types';

const initialState: AppState = {
  settings: {},
  keymaps: {},
  combos: {},
  modal: null,
  profile: null,
  workspace: null,
  viewport: { cols: null, rows: null },
};

export const useAppStore = create<AppStore>()(
  immer((set, get, api) => ({
    ...initialState,
    ...createAppActions(set, get, api),
  })),
);

export function getAppState(): AppStore {
  return useAppStore.getState();
}
