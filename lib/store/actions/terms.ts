import { v4 as uuidv4 } from 'uuid';
import { execCommand } from 'app/keymaps/commands';
import {
  getCurrentChildren,
  getGroupInfo,
  getGroupNode,
} from 'lib/store/selectors';

function createGroup(pid: string, term = true): IGroup {
  return <IGroup>{
    pid,
    id: term ? uuidv4() : pid,
    ratios: [],
    children: [],
    orientation: null,
    title: null,
  };
}

function removeChild(id: string, parent: IGroup) {
  const { children, ratios } = parent;

  for (let index = 0; index < children.length; index += 1) {
    const group = children[index];

    if (group.pid === id) {
      children.splice(index, 1);

      parent.ratios = equalizeRatios(ratios, children.length, index, -1);

      return true;
    }

    if (removeChild(id, group)) {
      if (group.children.length === 1) {
        const [child] = group.children;

        Object.keys(group).forEach(prop => {
          group[prop] = child[prop];
        });
      }

      return true;
    }
  }

  return false;
}

function equalizeRatios(
  ratios: number[],
  length: number,
  index: number,
  action: -1 | 1,
) {
  if (ratios.length > 0) {
    if (action === 1) {
      const ratio = 1 / (ratios.length + 1);

      ratios = ratios.map(value => value - ratio * value);

      ratios.splice(index, 0, ratio);
    } else {
      const ratio = ratios[index] / (ratios.length - 1);

      ratios.splice(index, 1);

      ratios = ratios.map(value => value + ratio);
    }

    return ratios;
  }

  return new Array<number>(length).fill(1 / length);
}

export function emitDispose(id: string) {
  const events = [
    ['process', 'kill'],
    ['terminal', 'dispose'],
  ];

  events.forEach(([channel, action]) => {
    execCommand(`${channel}:action`, action, id);
  });
}

export default (set: AlphaSet) => ({
  requestTerm(instance: IInstance, term = true, group?: IGroup) {
    set(state => {
      group = group ?? createGroup(instance.id, term);

      if (state.options.newTabPosition === 'current') {
        const { origin } = state.current;

        state = state.insert('context', group, origin);
      } else {
        state = state.set(['context', group.id], group);
      }

      if (instance.title && instance.hasCustomTitle) {
        const { title } = instance;

        state = state.set(['context', group.id, 'title'], title.trim());
      }

      return state
        .set(['instances', instance.id], instance)
        .set(['current', 'origin'], group.id)
        .set(['current', 'focused'], instance.id)
        .assign(['current'], [instance.id]);
    });
  },

  splitTerm(
    id: string,
    instance: IInstance,
    orientation: 'vertical' | 'horizontal',
  ) {
    set(state => {
      let { currentGroup, relativeGroup } = getGroupNode(state, id);

      if (!relativeGroup || relativeGroup.orientation !== orientation) {
        relativeGroup = currentGroup;
      }

      const { pid, children, ratios } = relativeGroup;

      if (pid) {
        children.unshift(createGroup(pid));
      }

      const { index } = getGroupInfo(state, id, true);

      children.splice(index, 0, createGroup(instance.id));

      state = state.update(['context', relativeGroup.id], {
        orientation,
        children,
        pid: null,
        ratios: equalizeRatios(ratios, children.length, index, 1),
      });

      return state
        .set(['instances', instance.id], instance)
        .set(['current', 'focused'], instance.id)
        .assign(['current'], [instance.id]);
    });
  },

  switchTerm(id: string, order: 'next' | 'previous' | number, pane = true) {
    set(state => {
      const children = getCurrentChildren(state, pane);

      let index = children.indexOf(id);

      if (order === 'next') {
        index += 1;

        if (index > children.length - 1) {
          index = 0;
        }
      } else if (order === 'previous') {
        index -= 1;

        if (index < 0) {
          index = children.length - 1;
        }
      } else if (order < children.length) {
        index = order;
      }

      id = children[index];

      if (!pane) {
        const {
          current: { terms },
        } = state;

        const [focused] = terms[id];

        return state.set('current', { origin: id, focused, terms });
      }

      return state.set(['current', 'focused'], id).assign(['current'], [id]);
    });

    return this;
  },

  resizeTerm(id: string, direction: 'up' | 'right' | 'down' | 'left') {
    set(state => {
      const { relativeGroup } = getGroupNode(state, id);

      if (relativeGroup) {
        const { orientation, ratios: _ratios, children } = relativeGroup;

        if (orientation && _ratios.length) {
          const ratios = [..._ratios];

          const index = children.findIndex(child => child.pid === id);

          if (orientation === 'vertical') {
            if (['up', 'down'].includes(direction)) return state;

            switch (index) {
              case 0: {
                if (direction === 'right') {
                  ratios[index] += 0.05;
                  ratios[index + 1] -= 0.05;
                } else {
                  ratios[index] -= 0.05;
                  ratios[index + 1] += 0.05;
                }

                break;
              }

              case children.length - 1: {
                if (direction === 'right') {
                  ratios[index] -= 0.05;
                  ratios[index - 1] += 0.05;
                } else {
                  ratios[index] += 0.05;
                  ratios[index - 1] -= 0.05;
                }

                break;
              }

              default: {
                if (direction === 'right') {
                  ratios[index] += 0.05;
                  ratios[index + 1] -= 0.05;
                } else {
                  ratios[index] += 0.05;
                  ratios[index - 1] -= 0.05;
                }

                break;
              }
            }
          } else {
            if (['right', 'left'].includes(direction)) return state;

            switch (index) {
              case 0: {
                if (direction === 'down') {
                  ratios[index] += 0.05;
                  ratios[index + 1] -= 0.05;
                } else {
                  ratios[index] -= 0.05;
                  ratios[index + 1] += 0.05;
                }

                break;
              }

              case children.length - 1: {
                if (direction === 'down') {
                  ratios[index] -= 0.05;
                  ratios[index - 1] += 0.05;
                } else {
                  ratios[index] += 0.05;
                  ratios[index - 1] -= 0.05;
                }

                break;
              }

              default: {
                if (direction === 'down') {
                  ratios[index] += 0.05;
                  ratios[index + 1] -= 0.05;
                } else {
                  ratios[index] += 0.05;
                  ratios[index - 1] -= 0.05;
                }

                break;
              }
            }
          }

          if (ratios.find(ratio => ratio < 0.1)) return state;

          state = state.update(['context', relativeGroup.id], { ratios });
        }
      }

      return state;
    });

    return this;
  },

  disposeTerm(id: string, origin: string) {
    set(state => {
      const { context, instances } = state;

      const group = context[origin];

      const children = getCurrentChildren(state, true);

      if (children.length === 1) {
        group.pid = id;

        state = state.set('session', { group, instances: [instances[id]] });
      }

      removeChild(id, group);

      return state.set(['context', origin], group).without(['instances', id]);
    });

    emitDispose(id);
  },
});
