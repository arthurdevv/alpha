import { create } from 'zustand';

import actions from './actions';
import helpers from './helpers';

const initialState = <WorkspacesState>{
  context: {},
  prompts: {},
  current: { tabs: {}, focused: null },
};

export default create<WorkspacesStore>()(set => ({
  ...initialState,
  ...helpers,
  ...actions(set),
}));
