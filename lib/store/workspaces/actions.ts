import { v4 as uuidv4 } from 'uuid';
import {
  createWorkspace,
  createWorkspaceGroup,
  createWorkspaceTab,
} from 'app/common/workspaces';
import { getChildIndexById, getGroupNode } from 'lib/store/workspaces/helpers';
import { equalizeRatios, removeChild } from 'lib/store/actions/terms';

export default (set: WorkspacesSet) => ({
  createWorkspace(t: any) {
    set(state => {
      let length = 0;
      for (const _ in state.context) length += 1;

      const workspace = createWorkspace(t, length);

      return state
        .set(['context', workspace.id], workspace)
        .set(['current', 'tabs', workspace.id], 0);
    });
  },

  updateWorkspace<K extends keyof IWorkspace>(
    id: string,
    key: K,
    value: IWorkspace[K],
  ) {
    set(state => state.set(['context', id, key], value));
  },

  deleteWorkspace(id: string) {
    set(state => {
      const { [id]: _, ...nextContext } = state.context;
      const { [id]: __, ...nextCurrentTabs } = state.current.tabs;

      return state
        .set(['context'], nextContext)
        .set(['current', 'tabs'], nextCurrentTabs);
    });
  },

  createTab(workspace: IWorkspace) {
    set(state => {
      const tab = createWorkspaceTab(workspace.tabs.length);

      const nextTabs = [...workspace.tabs, tab];

      return state
        .set(['context', workspace.id, 'tabs'], nextTabs)
        .set(['current', 'tabs', workspace.id], nextTabs.length - 1);
    });
  },

  updateTab(id: string, tabs: IWorkspaceTab[]) {
    set(state => state.set(['context', id, 'tabs'], tabs));
  },

  deleteTab(id: string, index: number) {
    set(state => {
      const { tabs } = state.context[id];

      const nextTabs = [...tabs.slice(0, index), ...tabs.slice(index + 1)];

      const nextIndex =
        nextTabs.length === 0 ? -1 : Math.min(index, nextTabs.length - 1);

      return state
        .set(['context', id, 'tabs'], nextTabs)
        .set(['current', 'tabs', id], nextIndex);
    });
  },

  setCurrentTab(id: string, index: number) {
    set(state =>
      state
        .set(['current', 'tabs', id], index)
        .set(['current', 'focused'], null),
    );
  },

  setGroupRatios(id: string, ratios: number[]) {
    set(state => {
      if (ratios.find(ratio => ratio < 0.1)) return state;

      return state.update(['context', id], { ratios });
    });
  },

  setFocusedGroup(id: string) {
    set(state => state.set(['current', 'focused'], id));
  },

  clearFocusedGroup(id: string, commands: string[]) {
    console.warn('bluring', id, 'with', commands);

    set(state =>
      state
        .update(['context', id], { commands })
        .set(['current', 'focused'], null),
    );
  },

  splitPane(group: IWorkspaceGroup, orientation: 'vertical' | 'horizontal') {
    set(state => {
      let { currentGroup, relativeGroup } = getGroupNode(state, group.id);

      if (!relativeGroup || relativeGroup.orientation !== orientation) {
        relativeGroup = currentGroup;
      }

      const { commands, children, ratios } = relativeGroup;

      const newChildren = [...children];

      if (commands) {
        newChildren.unshift(createWorkspaceGroup({ id: group.id, commands }));
      }

      const index = newChildren.findIndex(c => c.id === group.id);

      const newGroup = createWorkspaceGroup({});

      newChildren.splice(index, 0, newGroup);

      state = state.update(['context', relativeGroup.id], {
        id: uuidv4(),
        children: newChildren,
        orientation,
        commands: null,
        ratios: equalizeRatios(ratios, newChildren.length, index, 1),
      });

      // console.log(state.context);

      return state.set(['current', 'focused'], newGroup.id);
    });
  },

  closePane(id: string) {
    set(state => {
      let { currentGroup, relativeGroup } = getGroupNode(state, id);

      if (!relativeGroup) {
        relativeGroup = currentGroup;
      }

      console.log({ currentGroup, relativeGroup });

      if (!relativeGroup.orientation) {
        console.warn(`só é 1 pane puro. não faz nada...`);
        return state;
      }

      const flag = removeChild(id, relativeGroup);
      console.warn(`removou o child? ${flag}`);

      return state;

      // return state.set(['context', origin], group).without(['instances', id]);
    });
  },

  setPrompt(id: string, data: string) {
    set(state => state.set(['prompts', id], data));
  },

  replaceState(next: WorkspacesState | Partial<WorkspacesState>) {
    set(() => ({ ...next }));
  },
});
