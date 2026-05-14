import { useAppStore } from 'ui/store/app/store';
import { emitDispose, getGroupInfo, getGroupNode, getOriginChildren } from 'ui/store/terms/helpers';
import type { TermsActions, TermsState, TermsStore } from 'ui/store/terms/types';
import type { StoreActions, Term } from 'ui/types';

function createTerm(pid: UUID, blank = true): Term {
  return {
    pid,
    id: blank ? crypto.randomUUID() : pid,
    ratios: [],
    children: [],
    orientation: null,
  } satisfies Term;
}

function updateTerm(s: TermsState, id: string, partial: Partial<Term>): void {
  function update(target: object): boolean {
    return Object.values(target).some(child => {
      if (child.id === id) {
        Object.assign(child, partial);
        return true;
      }

      if (child.children?.length > 0) {
        return child.children.some((term: Term) => update({ [term.id]: term }));
      }

      return false;
    });
  }

  update(s.terms);
}

function deleteTerm(id: string, parent: Term): boolean {
  const { children, ratios } = parent;

  for (let index = 0; index < children.length; index += 1) {
    const term = children[index];

    if (term.pid === id) {
      children.splice(index, 1);
      parent.ratios = equalizeRatios(ratios, children.length, index, -1);

      return true;
    }

    if (deleteTerm(id, term)) {
      if (term.children.length === 1) Object.assign(term, term.children[0]);

      return true;
    }
  }

  return false;
}

export function insertTerm(s: TermsState, term: Term): void {
  const { newTabPosition } = useAppStore.getState().settings;

  if (newTabPosition === 'end') {
    s.terms[term.id] = term;
    return;
  }

  const entries = Object.entries(s.terms);

  if (origin && s.terms[origin]) {
    const index = entries.findIndex(([key]) => key === origin);
    entries.splice(index + 1, 0, [term.id, term]);
  } else {
    entries.push([term.id, term]);
  }

  s.terms = Object.fromEntries(entries);
}

export function cloneTerm(term: Term): Term {
  const children = term.children.map(cloneTerm);

  return {
    ...term,
    id: crypto.randomUUID(),
    pid: term.pid ? crypto.randomUUID() : null,
    children,
  };
}

function equalizeRatios(ratios: number[], count: number, index: number, action: -1 | 1) {
  if (ratios.length === 0) {
    return Array.from({ length: count }, () => 1 / count);
  }

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

export const createTermsActions: StoreActions<TermsStore, TermsActions> = set => ({
  requestTerm: (instance, blank) => {
    set(s => {
      const term = createTerm(instance.id, blank);
      insertTerm(s, term);

      s.focused[term.id] = [instance.id];
      s.instances[instance.id] = instance;

      s.createTab(instance.title, 'terminal');
    });
  },

  splitTerm: (id, instance, orientation) => {
    set(s => {
      let { currentGroup, relativeGroup } = getGroupNode(s, id);

      if (!relativeGroup || relativeGroup.orientation !== orientation) {
        relativeGroup = currentGroup;
      }

      const { pid, children, ratios } = relativeGroup;

      if (pid) {
        children.unshift(createTerm(pid));
      }

      const { index } = getGroupInfo(s, id, true);

      children.splice(index, 0, createTerm(instance.id));

      updateTerm(s, relativeGroup.id, {
        orientation,
        children,
        pid: null,
        ratios: equalizeRatios(ratios, children.length, index, 1),
      });

      s.instances[instance.id] = instance;
      s.focused[s.origin!] = [instance.id];
    });
  },

  switchTerm: (id, order, nested = true) => {
    set(s => {
      const children = getOriginChildren(s, nested) as UUID[];
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

      if (!nested) s.origin = id;
      else s.focused[s.origin!] = [id];
    });
  },

  resizeTerm: (id, direction) => {
    set(s => {
      const { relativeGroup } = getGroupNode(s, id);
      const { orientation, ratios, children } = relativeGroup;

      if (!relativeGroup || !orientation || !ratios.length) return;

      const isVertical = orientation === 'vertical';
      const isForward = direction === (isVertical ? 'right' : 'down');

      const blocked = isVertical ? ['up', 'down'] : ['right', 'left'];
      if (blocked.includes(direction)) return;

      const index = children.findIndex(child => child.pid === id);
      const step = 0.05;

      if (index === 0) {
        ratios[index] += isForward ? step : -step;
        ratios[index + 1] += isForward ? -step : step;
      } else if (index === children.length - 1) {
        ratios[index] += isForward ? -step : step;
        ratios[index - 1] += isForward ? step : -step;
      } else {
        ratios[index] += step;
        ratios[isForward ? index + 1 : index - 1] -= step;
      }

      if (ratios.some(r => r < 0.1)) return;

      updateTerm(s, relativeGroup.id, { ratios });
    });
  },

  disposeTerm: (id: string, origin: string) => {
    set(s => {
      const parent = s.terms[origin];
      const children = getOriginChildren(s, true);

      if (children.length === 1) {
        parent.pid = id;
      }

      deleteTerm(id, parent);

      s.terms[origin] = parent;
      delete s.instances[id];

      emitDispose(id);
    });
  },
});
