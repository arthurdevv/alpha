import type { AppActions, AppState, AppStore } from 'ui/store/app/types';
import type { StoreActions } from 'ui/types';

function invertKeymaps(keymaps: AppState['keymaps']): Record<string, string> {
  const combos: Record<string, string> = {};

  for (const [command, keys] of Object.entries(keymaps)) {
    for (const key of keys) {
      combos[key] = command;
    }
  }

  return combos;
}

export const createAppActions: StoreActions<AppStore, AppActions> = set => ({
  setSetting: (key, value, assign) => {
    set(s => {
      if (assign) {
        Object.assign(s.settings[key] as Record<string, unknown>, value);
      } else {
        s.settings[key] = value;
      }
    });
  },

  setSettings: partial => {
    set(s => {
      Object.assign(s.settings, partial);
    });
  },

  setKeymap: (command, combo) => {
    set(s => {
      const previous = s.combos[combo];

      if (previous) {
        s.keymaps[previous] = s.keymaps[previous].filter(k => k !== combo);
      }

      if (!s.keymaps[command]) {
        s.keymaps[command] = [];
      }

      if (!s.keymaps[command].includes(combo)) {
        s.keymaps[command].push(combo);
      }

      s.combos[combo] = command;
    });
  },

  setKeymaps: keymaps => {
    set(() => ({ keymaps, combos: invertKeymaps(keymaps) }));
  },

  setModal: modal => {
    set(() => ({ modal }));
  },

  setProfile: profile => {
    set(() => ({ profile }));
  },

  setWorkspace: workspace => {
    set(() => ({ workspace }));
  },

  setViewport: viewport => {
    set(() => ({ viewport }));
  },
});
