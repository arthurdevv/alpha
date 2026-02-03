import { getCurrentChildren } from 'lib/store/selectors';
import tabsActions from './tabs';
import termsActions, { emitDispose } from './terms';

export default (set: AlphaSet) => ({
  onSelect(id: string) {
    set(state => state.set(['current', 'origin'], id).set('modal', null));
  },

  onTitleChange(id: string, title: string) {
    set(state => {
      const { profile, hasCustomTitle } = state.instances[id];

      if (hasCustomTitle) return state;

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

      state.exec('process:resize', { id, cols, rows });

      return id === focused ? state.set('viewport', { cols, rows }) : state;
    });
  },

  onResizeGroup(id: string, ratios: number[]) {
    set(state => {
      if (ratios.find(ratio => ratio < 0.1)) return state;

      return state.update(['context', id], { ratios });
    });
  },

  onFocus(id: string, broadcast?: boolean) {
    set(state => {
      const { origin, terms } = state.current;

      if (typeof broadcast === 'boolean' && broadcast === true && origin) {
        const current = terms[origin];

        const children =
          current.length > 1 ? [id] : getCurrentChildren(state, true);

        return state.assign(['current'], children);
      }

      return state
        .assign(['current'], [id])
        .set(['current', 'focused'], id)
        .exec('terminal:focus');
    });

    return this;
  },

  onData(data: string) {
    set(state => {
      const {
        current: { origin, terms },
      } = state;

      const children = origin ? terms[origin] : [];

      children.forEach(id => state.exec('process:write', { id, data }));

      return state;
    });
  },

  onClose(id: string, kill = true) {
    set(state => {
      let {
        context,
        instances,
        current: { origin },
      } = state;

      if (kill) {
        state = state.set('session', {});

        const children = getCurrentChildren(state, true, id);

        children.forEach(id => {
          state = state
            .concat(['session', 'instances'], instances[id])
            .without(['instances', id]);

          emitDispose(id);
        });

        state = state.set(['session', 'group'], context[id]);
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

  setProfile(profile: IProfile | null) {
    set(state => state.set('profile', profile));
  },

  setWorkspace(workspace: IWorkspace | null) {
    set(state => state.set('workspace', workspace));
  },

  setModal(modal: string | null) {
    set(state => state.set('modal', modal));
    return this;
  },

  setProperty(property: keyof AlphaState, value: AlphaState[typeof property]) {
    set(state => state.set(property, value));
  },

  ...tabsActions(set),
  ...termsActions(set),
});
