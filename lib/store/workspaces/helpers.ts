import { getNestedObject } from 'lib/store/methods';

export function isPane(group: IWorkspaceGroup): boolean {
  return Array.isArray(group.commands) && group.orientation === null;
}

export function getAllPrompts(
  context: Record<string, IWorkspace>,
): WorkspacesState['prompts'] {
  const prompts: Record<string, string | null> = {};

  const search = (group: IWorkspaceGroup) => {
    if (isPane(group)) {
      prompts[group.id] = group.commands ? group.commands.join('\n') : null;
    }

    for (const child of group.children) search(child);
  };

  for (const ws of Object.values(context)) {
    for (const tab of ws.tabs) search(tab.group);
  }

  return prompts;
}

export function getCurrentEntries(
  context: Record<string, IWorkspace>,
): WorkspacesState['current'] {
  const tabs: Record<string, number> = {};

  for (const ws of Object.values(context)) {
    const tabIndex = 0;
    tabs[ws.id] = tabIndex;

    const tab = ws.tabs[tabIndex];
    if (!tab) continue;
  }

  return { tabs, focused: null };
}

export function getGroupNode(
  { context }: WorkspacesState,
  id: string,
): Record<string, IWorkspaceGroup> {
  const search = (
    group: IWorkspaceGroup,
    relativeGroup: IWorkspaceGroup | null,
  ) => {
    if (group?.id === id) return { currentGroup: group, relativeGroup };

    for (const child of group.children) {
      const found = search(child, group);
      if (found) return found;
    }

    return null;
  };

  for (const ws of Object.values(context)) {
    for (const tab of ws.tabs) {
      const found = search(tab.group, null);
      if (found) return found;
    }
  }

  return {};
}

export function getChildIndexById(
  { context }: WorkspacesState,
  id: string,
): number {
  const search = (group: IWorkspaceGroup): number => {
    for (let i = 0; i < group.children.length; i++) {
      const child = group.children[i];

      if (child.id === id) return i;

      const nested = search(child);
      if (nested !== -1) return nested;
    }

    return -1;
  };

  for (const ws of Object.values(context)) {
    for (let t = 0; t < ws.tabs.length; t++) {
      const index = search(ws.tabs[t].group);
      if (index !== -1) return index;
    }
  }

  return -1;
}

export function cloneGroup(group: IWorkspaceGroup): IWorkspaceGroup {
  return {
    ...group,
    commands: group.commands ? [...group.commands] : null,
    ratios: [...group.ratios],
    children: group.children.map(cloneGroup),
  };
}

export function getFirstPaneId(group: IWorkspaceGroup): string {
  let node = group;

  while (node.orientation && node.children.length) {
    node = node.children[0];
  }

  return node.id;
}

export default {
  set(path: string | string[], value: any): WorkspacesStore {
    const prototype = Object.getPrototypeOf(this);

    const target = Object.create(prototype);

    Object.keys(this).forEach(key => {
      if (Object.getOwnPropertyDescriptor(this, key)) {
        target[key] = this[key];
      }
    });

    return getNestedObject(target, path, value);
  },

  update(path: string[], value: any): WorkspacesStore {
    const [first, groupId] = path;

    const context = this[first] as Record<string, IWorkspace>;

    if (!context || !groupId) return this as WorkspacesStore;

    const patch = (group: IWorkspaceGroup) => {
      if (group.id === groupId) return [{ ...group, ...value }, true];

      if (!group.children.length) return [group, false];
      let changed = false;

      const nextChildren = group.children.map(child => {
        const [nextChild, childChanged] = patch(child);
        if (childChanged) changed = true;

        return nextChild;
      });

      if (!changed) return [group, false];

      return [{ ...group, children: nextChildren }, true];
    };

    let didChange = false;
    const nextContext: Record<string, IWorkspace> = { ...context };

    for (const [key, ws] of Object.entries(context)) {
      let changed = false;

      const nextTabs = ws.tabs.map(tab => {
        const [nextGroup, groupChanged] = patch(tab.group);
        if (!groupChanged) return tab;

        changed = true;

        return { ...tab, group: nextGroup };
      });

      if (changed) {
        didChange = true;
        nextContext[key] = { ...ws, tabs: nextTabs };
      }
    }

    if (!didChange) return this as WorkspacesStore;

    return this.set([first], nextContext);
  },

  without(path: string[]) {
    const [first, ...rest] = path;

    const target = this[first];

    rest.forEach(key => {
      delete target[key];
    });

    return this.set(first, target);
  },
};
