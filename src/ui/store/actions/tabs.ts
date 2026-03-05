import { v4 as uuidv4 } from 'uuid';
import { getCurrentChildren } from 'lib/store/selectors';

function insertTab(state: AlphaStore, group: IGroup): AlphaStore {
  const { newTabPosition } = state.options;

  if (newTabPosition === 'current') {
    state = state.insert('context', group, origin);
  } else {
    state = state.set(['context', group.id], group);
  }

  return state;
}

function assignCurrent(
  state: AlphaStore,
  group: IGroup,
  id: string,
): AlphaStore {
  return state
    .set(['current', 'origin'], group.id)
    .set(['current', 'focused'], id)
    .assign(['current'], [id]);
}

function cloneGroup(group: IGroup): IGroup {
  const children = group.children.map(cloneGroup);

  return {
    ...group,
    id: uuidv4(),
    pid: group.pid ? uuidv4() : null,
    children,
  };
}

export default (set: AlphaSet) => ({
  renameTab(id: string, title: string) {
    set(state => state.set(['context', id, 'title'], title.trim()));
  },

  duplicateTab(id: string) {
    set(state => {
      const { context, instances, current } = state;

      const group = cloneGroup(context[id]);

      state = insertTab(state, group);

      const children = getCurrentChildren(state, true, group.id);
      const source = getCurrentChildren(state, true, id);

      children.forEach((id, index) => {
        const child = source[index];
        const instance = { ...instances[child], id };

        state = state
          .set(['instances', instance.id], instance)
          .exec('terminal:create', instance);
      });

      const [focused] = current.terms[id];

      const index = source.findIndex(id => id === focused);

      return assignCurrent(state, group, children[index]);
    });
  },

  reopenClosedTab() {
    set(state => {
      const {
        session: { group, instances },
      } = state;

      state = insertTab(state, group);

      instances.forEach(instance => {
        state = state
          .set(['instances', instance.id], instance)
          .exec('terminal:create', instance);
      });

      const [{ id }] = instances;

      return assignCurrent(state, group, id).set('session', {});
    });
  },
});
