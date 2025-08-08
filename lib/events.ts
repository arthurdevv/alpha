import { getSettings } from 'app/settings';
import { bindKeymaps } from 'app/keymaps';
import { getDefaultProfile } from 'app/common/profiles';
import { terms } from 'app/common/terminal';
import { appDir } from 'app/settings/constants';
import listeners from 'app/settings/listeners';
import storage from 'app/utils/local-storage';
import ipc from 'shared/renderer';
import { isNonEmptyObject } from './utils';

export default ({ getStore }: AlphaStore) => {
  const store = getStore();

  ipc.on('terminal:request', ({ instance }) => {
    const { newTabPosition } = getCurrent();

    store.requestTerm(instance, true, newTabPosition);
  });

  ipc.on('terminal:write', ({ id, data }) => {
    const term = terms[id];

    if (term) term.write(data);
  });

  ipc.on('terminal:close', () => {
    const { origin } = getCurrent();

    if (origin) store.onClose(origin);
  });

  ipc.on('terminal:search', () => {
    const { id } = getCurrent();

    if (id) {
      global.id = id;

      store.setModal('Search');
    }
  });

  ipc.on('terminal:connected', value => {
    const { id } = getCurrent();

    store.onConnect(id, value);
  });

  ipc.on('terminal:action', action => {
    const { id } = getCurrent();

    if (id) {
      const term = terms[id];

      if (term) {
        if (action === 'clear') ipc.send('process:action', { id, action });

        term[action]();
      }
    }
  });

  ipc.on('process:action', (action, id) => {
    const { id: focused } = getCurrent();

    id = id || focused;

    if (id) ipc.send('process:action', { id, action });
  });

  ipc.on('pane:request', ({ id, instance, orientation }) => {
    store.splitTerm(id, instance, orientation);
  });

  ipc.on('pane:split', orientation => {
    const { id, instances } = getCurrent();

    if (id) {
      const { profile, isExpanded } = instances[id];

      if (!isExpanded) ipc.send('pane:create', { id, profile, orientation });
    }
  });

  ipc.on('pane:move', direction => {
    const { id, instances } = getCurrent();

    if (id) {
      const { isExpanded } = instances[id];

      if (!isExpanded) store.switchTerm(id, direction);
    }
  });

  ipc.on('pane:action', action => {
    const { id, children, instances, modal } = getCurrent();

    if (children.length > 1) {
      if (action === 'expand' && (!modal || modal === 'ContextMenu')) {
        store.onExpand(id);
      } else {
        const { isExpanded } = instances[id];

        if (!isExpanded) store.onFocus(id, true);
      }
    }
  });

  ipc.on('pane:close', () => {
    let { id, origin, children } = getCurrent();

    if (origin) {
      id = global.id || id;

      store.switchTerm(id, 'previous').disposeTerm(id, origin);

      if (children.length === 0) store.onClose(origin, false);
    }
  });

  ipc.on('tab:move', direction => {
    const { origin } = getCurrent();

    if (origin) store.switchTerm(origin, direction, false);
  });

  ipc.on('app:settings', section => {
    const { modal, newTabPosition } = getCurrent();

    if (modal) store.setModal(null);

    if (section) storage.updateItem('section', section);

    store.requestTerm(
      <IInstance>{ id: 'Settings', title: 'Settings' },
      false,
      newTabPosition,
    );
  });

  ipc.on('app:modal', value => {
    const { modal } = getStore();

    if (typeof value === 'string') {
      value = `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
    }

    if (modal === value && modal !== 'ContextMenu') return;

    if (modal) {
      store.setModal(null);

      setTimeout(() => store.setModal(value), 100);
    } else {
      store.setModal(value);
    }
  });

  ipc.on('app:update-session', ({ snapshot }) => {
    const { context, instances, current } = getStore();

    if ('Settings' in context) delete context['Settings'];

    storage.updateItem('session', { context, instances, current, snapshot });
  });

  ipc.on('app:second-instance', ({ cwd }) => {
    const profile = getDefaultProfile();

    if (profile.type === 'shell' && cwd !== appDir) profile.options.cwd = cwd;

    ipc.send('terminal:create', profile);
  });

  ipc.on('app:renderer-ready', () => {
    const { openOnStart, restoreOnStart } = getSettings();

    listeners
      .subscribe('options', () => {
        const settings = getSettings();

        ['opacity', 'alwaysOnTop'].forEach(option => {
          ipc.send(`window:${option}`, settings[option]);
        });

        store.setOptions(settings);
      })
      .subscribe('keymaps', bindKeymaps);

    if (restoreOnStart) {
      const session: ISession | undefined = storage.parseItem('session');

      if (session && isNonEmptyObject(session)) {
        ipc.send('app:restore-session', session);

        Object.keys(session)
          .filter(key => key !== 'session')
          .forEach(key =>
            store.setProperty(key as keyof AlphaState, session[key]),
          );
      }
    }

    if (openOnStart || process.env.ALPHA_CLI || process.cwd() !== appDir) {
      ipc.send('terminal:create');
    }
  });

  function getCurrent() {
    const store = getStore();

    const {
      context,
      current: { origin, focused, terms },
      modal,
      options,
    } = store;

    const { children } = origin ? context[origin] : { children: [] };

    let [id] = origin ? terms[origin] : focused;

    if (modal === 'ContextMenu') {
      id = global.id || id;
    }

    return { origin, id, children, ...store, ...options };
  }
};
