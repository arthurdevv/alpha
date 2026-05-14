import { useAppStore } from 'ui/store/app/store';
import { emitDispose, getOriginChildren } from 'ui/store/terms/helpers';
import type { TabsActions, TermsState, TermsStore } from 'ui/store/terms/types';
import type { StoreActions, Tab } from 'ui/types';

import { cloneTerm, insertTerm } from './terms';

function createTab(title: string, type: 'terminal' | 'settings'): Tab {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    type,
  } satisfies Tab;
}

// function assignCurrent(
//   state: AlphaStore,
//   group: Term,
//   id: string,
// ): AlphaStore {
//   return state
//     .set(['current', 'origin'], group.id)
//     .set(['current', 'focused'], id)
//     .assign(['current'], [id]);
// }

function cloneTab(s: TermsStore, id: UUID): void {
  const { id: _, title, type } = s.tabs[id];
  const tab = createTab(title, type);

  s.tabs[tab.id] = tab;
}

export const createTabsActions: StoreActions<TermsStore, TabsActions> = set => ({
  createTab: (title, type) => {
    set(s => {
      const tab = createTab(title, type);

      // ESSA LÓGICA TA ERRADA
      // const existing = Object.values(s.tabs).find(t => t.type === 'settings');

      // if (existing) {
      //   s.origin = existing.id;
      //   return;
      // }

      s.tabs[tab.id] = tab;
      s.origin = tab.id;
    });
  },

  selectTab: id => {
    set(s => {
      s.origin = id;
      // useAppStore.getState().setModal(null);
    });
  },

  renameTab: (id, title) => {
    set(s => {
      s.tabs[id].title = title.trim();
    });
  },

  duplicateTab: id => {
    set(s => {
      cloneTab(s, id);

      const term = cloneTerm(s.terms[id]);
      insertTerm(s, term);

      const children = getOriginChildren(s, true, id);

      // children.forEach((id, index) => {
      //   const child = source[index];
      //   const instance = { ...instances[child], id };

      //   s = s
      //     .set(['instances', instance.id], instance)
      //     .exec('terminal:create', instance);
      // });

      // const [focused] = s.focused[id];
      // const index = source.findIndex(id => id === focused);

      // return assignCurrent(s, group, children[index]);
    });
  },

  closeTab: (id, dispose = true) => {
    set(s => {
      if (dispose) {
        const children = getOriginChildren(s, true, id);

        children.forEach(id => {
          delete s.instances[id];
          emitDispose(id);
        });
      }

      const tabs = Object.keys(s.tabs) as UUID[];

      if (tabs.length === 1) {
        s.origin = null;
        s.focused = {};
      } else {
        const index = tabs.indexOf(id);

        if (id === tabs[tabs.length - 1]) {
          s.origin = tabs[index - 1];
        } else if (id === origin) {
          s.origin = tabs[index + 1];
        }
      }

      delete s.tabs[id];
      delete s.terms[id];
    });
  },
});
