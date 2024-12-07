import { getSettings } from 'app/settings';
import { bindKeymaps } from 'app/keymaps';
import { terms } from 'app/common/terminal';
import { appDir } from 'app/settings/constants';
import listeners from 'app/settings/listeners';
import storage from 'app/utils/local-storage';
import ipc from 'shared/renderer';
import { isNonEmptyObject } from './utils';

export default ({ getStore }: AlphaStore) => {
  const store = getStore();

  ipc.on('terminal:request', ({ process }) => {
    store.requestTerm(process);
  });

  ipc.on('terminal:write', ({ id, data }) => {
    const term = terms[id];

    if (term) term.write(data);
  });

  ipc.on('terminal:action', action => {
    const { id } = getCurrent();

    if (id) {
      const term = terms[id];

      if (term) {
        if (action === 'clear') ipc.send('process:clear', { id });

        term[action]();
      }
    }
  });

  ipc.on('terminal:search', () => {
    const { id } = getCurrent();

    global.id = id;

    if (id) store.setModal('Search');
  });

  ipc.on('terminal:close', () => {
    const { origin } = getCurrent();

    if (origin) store.onClose(origin);
  });

  ipc.on('pane:request', ({ id, process, orientation }) => {
    store.splitTerm(id, process, orientation);
  });

  ipc.on('pane:split', orientation => {
    const { id, processes } = getCurrent();

    if (id) {
      const { profile, isExpanded } = processes[id];

      if (!isExpanded) ipc.send('pane:create', { id, profile, orientation });
    }
  });

  ipc.on('pane:move', direction => {
    const { id, processes } = getCurrent();

    if (id) {
      const { isExpanded } = processes[id];

      if (!isExpanded) store.switchTerm(id, direction);
    }
  });

  ipc.on('pane:action', action => {
    const { id, children, processes, modal } = getCurrent();

    if (children.length > 1) {
      if (action === 'expand' && (!modal || modal === 'ContextMenu')) {
        store.onExpand(id);
      } else {
        const { isExpanded } = processes[id];

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

  ipc.on('app:settings', () => {
    const { modal } = getStore();

    if (modal) store.setModal(null);

    store.requestTerm({ id: 'Settings', title: 'Settings' } as IProcess, false);
  });

  ipc.on('app:modal', value => {
    const { modal } = getStore();

    if (typeof value === 'string') {
      value = `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
    }

    if ((modal && modal !== value) || modal === value) {
      store.setModal(null);

      setTimeout(() => store.setModal(value), 100);
    } else if (!modal) {
      store.setModal(value);
    }
  });

  ipc.on('app:update-session', ({ instances }) => {
    const { context, processes, current } = getStore();

    if ('Settings' in context) delete context['Settings'];

    storage
      .deleteItem('session')
      .updateItem('session', { context, processes, current, instances });
  });

  ipc.on('ipc-renderer-ready', () => {
    listeners.subscribe('keymaps', bindKeymaps);

    const { openOnStart, restoreOnStart } = getSettings();

    if (restoreOnStart) {
      const session: ISession = storage.parseItem('session');

      if (isNonEmptyObject(session)) {
        ipc.send('app:restore-session', session);

        Object.keys(session)
          .filter(key => key !== 'instances')
          .forEach(key =>
            store.setProperty(key as keyof AlphaState, session[key]),
          );
      }
    }

    if (openOnStart || process.env.ALPHA_CLI || process.cwd() !== appDir) {
      ipc.send('terminal:create');
    }
  });

  listeners.subscribe('options', () => store.setOptions(getSettings));

  function getCurrent() {
    const store = getStore();

    const {
      context,
      current: { origin, focused, instances },
      modal,
    } = store;

    const { children } = origin ? context[origin] : { children: [] };

    let [id] = origin ? instances[origin] : focused;

    if (modal === 'ContextMenu') {
      id = global.id || id;
    }

    return { origin, id, children, ...store };
  }
};
