import { getCurrentWindow, globalShortcut } from '@electron/remote';
import { getSettings } from 'app/settings';
import { bindKeymaps } from 'app/keymaps';
import { terms } from 'app/common/terminal';
import { watchCommand } from 'app/keymaps/schema';
import { formatCommand } from 'app/keymaps/commands';
import { getDefaultProfile } from 'app/common/profiles';
import { loadTheme, setThemeVariables } from 'app/common/themes';
import { appDir } from 'app/settings/constants';
import listeners from 'app/settings/listeners';
import storage from 'app/utils/local-storage';
import ipc from 'shared/ipc/renderer';
import { isNonEmptyObject } from './utils';

let rendererIsReady: boolean = false;

export default (getStore: () => AlphaStore) => {
  const store = getStore();

  ipc.on('terminal:request', ({ instance }) => {
    store.requestTerm(instance, true);
  });

  ipc.on('terminal:write', ({ id, data }) => {
    const term = terms[id];

    if (term) term.write(data);
  });

  ipc.on('terminal:action', (action: any, dispose?: string) => {
    let { id } = getCurrent();

    id = dispose || id;

    if (action.includes('connected')) {
      const [, value] = action;

      return store.onConnect(id, value);
    }

    if (id) {
      const term = terms[id];

      if (term) {
        if (action === 'clear') ipc.send('process:action', { id, action });

        term[action]();
      }
    }
  });

  ipc.on('terminal:modal', (modal: string) => {
    const { id, instance } = getCurrent();

    if (
      id === 'Settings' ||
      (modal === 'history' && instance && instance.profile.type !== 'shell')
    )
      return;

    if (id) {
      global.id = id;

      ipc.emit('app:modal', modal);
    }
  });

  ipc.on('terminal:save-history', ({ id, where, buffer, executedAt, ...t }) => {
    const history: Record<string, ICommand[]> = storage.parseItem('history');

    const command: ICommand = {
      buffer,
      where,
      executedAt,
      executionTime: Math.abs(Math.round(t.executionTime - t.entryTime)),
    };

    history[id] ??= [];
    history[id].unshift(command);

    storage.updateItem('history', history);
  });

  ipc.on('terminal:zen-mode', (toggle: boolean = true) => {
    const isZenMode = storage[toggle ? 'toggleItem' : 'parseItem']('zen-mode');

    const {
      options: { showTabs, hideIndicators },
    } = getCurrent();

    const flags = {
      'zen-mode': isZenMode,
      'zen-mode-show-tabs': showTabs,
      'zen-mode-hide-indicators': hideIndicators,
    };

    const root = document.documentElement;

    Object.entries(flags).forEach(([key, value]) => {
      if (isZenMode) root.setAttribute(`${key}`, `${value}`);
      else root.removeAttribute(`${key}`);
    });
  });

  ipc.on('process:action', (action: string, id: string) => {
    const { id: focused } = getCurrent();

    id = id || focused;

    if (id) ipc.send('process:action', { id, action });
  });

  ipc.on('pane:request', ({ id, instance, orientation }) => {
    store.splitTerm(id, instance, orientation);
  });

  ipc.on('pane:action', (action: string) => {
    const { id, children, instances, modal } = getCurrent();

    if (children.length > 1) {
      if (
        ['expand', 'collapse'].includes(action) &&
        (!modal || modal === 'TerminalContextMenu')
      ) {
        store.onFocus(id, false).onExpand(id);
      } else {
        const { isExpanded } = instances[id];

        if (!isExpanded) store.onFocus(id, true);
      }
    }
  });

  ipc.on('pane:layout', (action: string, orientation: any) => {
    const { id, focused, instances } = getCurrent();

    if (id) {
      const { profile, isExpanded } = instances[id];

      if (!isExpanded) {
        switch (action) {
          case 'split':
            return ipc.send('pane:create', { id, profile, orientation });

          case 'focus':
            return store.switchTerm(id, orientation);

          case 'resize':
            return store.resizeTerm(focused, orientation);
        }
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

  ipc.on('tab:layout', (order: any) => {
    const { origin } = getCurrent();

    if (origin) store.switchTerm(origin, order, false);
  });

  ipc.on('tab:action', (action: string) => {
    const { origin, tabs, session } = getCurrent();

    const id = global.id || origin;

    switch (action) {
      case 'close-others':
      case 'close-right': {
        if (id) {
          const index = tabs.indexOf(id);

          tabs
            .filter((_, i) =>
              /others/i.test(action) ? i !== index : i > index,
            )
            .forEach(id => store.onClose(id));
        }

        break;
      }

      case 'reopen-closed': {
        if (session.group) store.reopenClosedTab();
        break;
      }

      case 'rename': {
        if (id) store.setModal('Rename');
        break;
      }

      case 'close': {
        if (id) store.onClose(id);
        break;
      }

      default: {
        if (id) {
          action = formatCommand(`tab:${action}`);
          store[action](id);
        }
      }
    }
  });

  ipc.on('app:settings', (section: string) => {
    const { modal } = getCurrent();

    if (modal) store.setModal(null);

    if (section) {
      storage.updateItem('section', section);

      global.handleSection && global.handleSection(section);
    }

    store.requestTerm(<IInstance>{ id: 'Settings', title: 'Settings' }, false);
  });

  ipc.on('app:modal', (value: string) => {
    const { modal } = getStore();

    if (typeof value === 'string') {
      value = `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
    }

    if (modal === value) {
      if (value === 'Keymaps') global.handleModal(undefined, null);
      return;
    }

    if (modal) {
      global.handleModal(undefined, value);
    } else {
      store.setModal(value);
    }
  });

  ipc.on('app:update-session', ({ snapshot }) => {
    const { context, instances, current } = getStore();

    storage.updateItem('session', { context, instances, current, snapshot });
  });

  ipc.on('app:second-instance', ({ cwd }) => {
    const profile = getDefaultProfile();

    if (profile.type === 'shell') profile.options.cwd = cwd;

    ipc.send('terminal:create', { profile });
  });

  ipc.on('app:renderer-ready', () => {
    if (rendererIsReady) return;

    let isFirstRendering = true;

    const { openOnStart, restoreOnStart, workspaces, workspace } =
      getSettings();

    listeners
      .subscribe('options', () => {
        const {
          options,
          current: { origin },
        } = getStore();

        const settings = getSettings();

        store.setOptions(settings);

        if (
          settings.theme !== options.theme ||
          settings.preserveBackground !== options.preserveBackground
        ) {
          if (origin && origin !== 'Settings') {
            const theme = loadTheme(settings.theme);

            setThemeVariables(theme, settings);
          }
        }

        ['opacity', 'alwaysOnTop'].forEach(option => {
          if (options[option] !== settings[option]) {
            ipc.send(`window:${option}`, settings[option]);
          }
        });

        if (!isFirstRendering) {
          ['showTabs', 'hideIndicators'].forEach(option => {
            if (options[option] !== settings[option]) {
              ipc.emit('terminal:zen-mode', false);
            }
          });
        }

        isFirstRendering = false;
      })
      .subscribe('keymaps', bindKeymaps);

    watchCommand('window:toggle-visibility', keymaps => {
      globalShortcut.unregisterAll();

      keymaps.forEach(keys => {
        globalShortcut.register(keys, () => {
          const currentWindow = getCurrentWindow();

          if (currentWindow.isVisible()) {
            currentWindow.hide();
          } else {
            currentWindow.show();
            currentWindow.focus();
          }
        });
      });
    });

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

    const startupWorkspace = workspaces.find(w => w.id === workspace);

    if (startupWorkspace) ipc.send('app:run-workspace', startupWorkspace);

    if (openOnStart || process.env.ALPHA_CLI || process.cwd() !== appDir) {
      ipc.send('terminal:create', {});
    }

    rendererIsReady = true;
  });

  function getCurrent() {
    const store = getStore();

    const {
      context,
      instances,
      current: { origin, focused, terms },
      modal,
      options,
    } = store;

    const { children = [] } = (origin && context[origin]) || {};

    let [id] = origin ? terms[origin] : focused;

    if (modal && modal.includes('ContextMenu')) {
      id = global.id || id;
    }

    return {
      id,
      origin,
      focused,
      children,
      tabs: Object.keys(context),
      instance: instances[focused],
      ...store,
      ...options,
    };
  }
};
