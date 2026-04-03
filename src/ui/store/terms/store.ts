import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createTabsActions } from './actions/tabs';
import { createTermsActions } from './actions/terms';
import type { TermsState, TermsStore } from './types';

const initialState: TermsState = {
  tabs: {},
  terms: {},
  instances: {},
  focused: {},
  origin: null,
};

export const useTermsStore = create<TermsStore>()(
  immer((set, get, api) => ({
    ...initialState,
    ...createTabsActions(set, get, api),
    ...createTermsActions(set, get, api),
  })),
);

export function getTermsState(): TermsStore {
  return useTermsStore.getState();
}
