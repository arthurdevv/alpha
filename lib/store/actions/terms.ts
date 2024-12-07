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

export default (set: AlphaSet) => ({
  requestTerm(process: IProcess, term = true) {
    set(state => {
      const group = createGroup(process.id, term);

      return state
        .set(['context', group.id], group)
        .set(['processes', process.id], process)
        .set(['current', 'origin'], group.id)
        .set(['current', 'focused'], process.id)
        .assign(['current'], [process.id]);
    });
  },

  splitTerm(
    id: string,
    process: IProcess,
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

      children.splice(index, 0, createGroup(process.id));

      state = state.update(['context', relativeGroup.id], {
        orientation,
        children,
        pid: null,
        ratios: equalizeRatios(ratios, children.length, index, 1),
      });

      return state
        .set(['processes', process.id], process)
        .set(['current', 'focused'], process.id)
        .assign(['current'], [process.id]);
    });
  },

  switchTerm(id: string, direction: 'next' | 'previous' | number, pane = true) {
    set(state => {
      const children = getCurrentChildren(state, pane);

      let index = children.indexOf(id);

      if (direction === 'next') {
        index += 1;

        if (index > children.length - 1) {
          index = 0;
        }
      } else if (direction === 'previous') {
        index -= 1;

        if (index < 0) {
          index = children.length - 1;
        }
      } else {
        index = direction;

        if (index > children.length) {
          index = children.length - 1;
        }
      }

      id = children[index];

      if (!pane) {
        const {
          current: { instances },
        } = state;

        const [focused] = instances[id];

        return state.set('current', { origin: id, focused, instances });
      }

      return state.set(['current', 'focused'], id).assign(['current'], [id]);
    });

    return this;
  },

  disposeTerm(id: string, origin: string) {
    set(state => {
      const group = state.context[origin];

      removeChild(id, group);

      return state.set(['context', origin], group).without(['processes', id]);
    });

    execCommand('process:kill', { id });
  },
});
