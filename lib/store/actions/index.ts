import { execCommand } from 'app/keymaps/commands';
import { getCurrentChildren } from 'lib/store/selectors';
import actions from './terms';

export default (set: AlphaSet) => ({
  onSelect(id: string) {
    set(state => state.set(['current', 'origin'], id).set('modal', null));
  },

  onTitleChange(id: string, title: string) {
    set(state => {
      const { profile } = state.instances[id];

      return state.set(
        ['instances', id, 'title'],
        profile.title ? profile.name : title.trim(),
      );
    });
  },

  onExpand(id: string) {
    set(state => state.toggle(['instances', id, 'isExpanded']));
  },

  onConnect(id: string, value: boolean) {
    set(state => state.set(['instances', id, 'isConnected'], value));
  },

  onResize(id: string, { cols, rows }: IViewport) {
    set(state => {
      const { focused } = state.current;

      return id === focused ? state.set('viewport', { cols, rows }) : state;
    });

    execCommand('process:resize', { id, cols, rows });
  },

  onResizeGroup(id: string, ratios: number[]) {
    set(state => {
      if (ratios.find(ratio => ratio < 0.1)) {
        return state;
      }

      return state.update(['context', id], { ratios });
    });
  },

  onFocus(id: string, broadcast?: boolean) {
    set(state => {
      const { origin, terms } = state.current;

      if (typeof broadcast === 'boolean' && origin) {
        const current = terms[origin];

        const children =
          current.length > 1 ? [id] : getCurrentChildren(state, true);

        return state.assign(['current'], children);
      }

      return state.set(['current', 'focused'], id).assign(['current'], [id]);
    });

    execCommand('terminal:focus').then(() => execCommand('app:modal', null));
  },

  onData(data: string) {
    set(state => {
      const {
        current: { origin, terms },
      } = state;

      const children = origin ? terms[origin] : [];

      children.forEach(id => execCommand('process:write', { id, data }));

      return state;
    });
  },

  onClose(id: string, kill = true) {
    set(state => {
      let {
        context,
        current: { origin },
      } = state;

      if (kill) {
        const children = getCurrentChildren(state, true, id);

        children.forEach(id => {
          state = state.without(['instances', id]);

          execCommand('process:action', 'kill', id);
        });
      }

      const tabs = Object.keys(context);

      if (tabs.length === 1) {
        state = state.set('current', { origin: null, focused: '', terms: {} });
      } else {
        const index = tabs.indexOf(id);

        if (id === tabs[tabs.length - 1]) {
          origin = tabs[index - 1];
        } else if (id === origin) {
          origin = tabs[index + 1];
        }

        state = state.set(['current', 'origin'], origin);
      }

      return state.without(['context', id]);
    });
  },

  setOptions(options: ISettings) {
    set(state => state.set('options', options));
  },

  setModal(modal: string | null) {
    set(state => state.set('modal', modal));

    return this;
  },

  setProfile(profile: IProfile | null) {
    set(state => state.set('profile', profile));
  },

  setProperty(property: keyof AlphaState, value: AlphaState[typeof property]) {
    set(state => state.set(property, value));
  },

  ...actions(set),
});
