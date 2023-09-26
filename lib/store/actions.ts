import { v4 as uuidv4 } from 'uuid';
import { processes } from 'app/common/process';

export default (set: AlphaSet) => ({
  createTab({ process, shell }: IProcessArgs, term = true) {
    set(state => {
      const id = term ? uuidv4() : 'Settings';

      processes[id] = process || null;

      return state
        .setIn([id], {
          title: term ? 'Terminal' : id,
          shell: shell ? shell.split('\\').pop() : null,
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

  onTitleChange(id: string, title: string) {
    set(state => state.setIn([id, 'title'], title.trim()));
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

  setMenu(menu: string | undefined) {
    set(() => ({ menu }));
  },
});
