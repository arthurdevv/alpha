import { v4 as uuidv4 } from 'uuid';
import { processes } from 'app/common/process';

export default (set: AlphaSet) => ({
  createTab(process: IProcessFork | null, title?: string | undefined) {
    set(state => {
      const id = title !== 'Settings' ? uuidv4() : title;

      if (process) {
        processes[id] = process;
      }

      return state
        .setIn([id], <ITerminal>{
          name: title,
          title,
          shell: process ? process.shell : null,
          isDirty: true,
        })
        .set('current', id);
    });
  },

  onSelect(id: string) {
    set(() => ({ current: id }));
  },

  onResize(cols: number, rows: number) {
    set(() => ({ cols, rows }));
  },

  onTitleChange(id: string, name: string | undefined, title: string) {
    set(state => (name ? state : state.setIn([id, 'title'], title.trim())));
  },

  onClose(id: string) {
    set(state => {
      let { context, current } = state;

      const tabs = Object.keys(context);

      if (tabs.length > 0) {
        const index = tabs.indexOf(id);

        switch (id) {
          case tabs[tabs.length - 1]:
            current = tabs[index - 1];
            break;

          case current:
            current = tabs[index + 1];
            break;
        }

        setTimeout(() => {
          state.set('current', current);
        }, 10);
      }

      delete context[id];

      return { context };
    });
  },

  moveTo(action: -1 | 0 | 1, index?: number) {
    set(state => {
      const { context, current } = state;

      const tabs = Object.keys(context);

      if (action !== 0) {
        index = tabs.indexOf(current!) + action;
      } else {
        index = index || 0;
      }

      let id: string;

      if (index >= 0 && index < tabs.length) {
        id = tabs[index];
      } else if (action === 1) {
        id = tabs[0];
      } else {
        id = tabs[tabs.length - 1];
      }

      return { current: id };
    });
  },

  setCurrentClear() {
    set(state => {
      const { current } = state;

      if (current) {
        state.setIn([current, 'isDirty'], false);
      }

      return state;
    });
  },

  setOptions(options: ISettings) {
    set(() => ({ options }));
  },

  setModal(modal: string | undefined) {
    set(() => ({ modal }));
  },

  setProfile(profile: IProfile | undefined) {
    set(() => ({ profile }));
  },

  updateProfile(key: string, value: any) {
    set(state => {
      const { profile } = state;

      if (profile) {
        const { title, options } = profile;

        (key in options ? profile.options : profile)[key] =
          key === 'title' ? !title : value;
      }

      return state.set('profile', profile);
    });
  },
});
