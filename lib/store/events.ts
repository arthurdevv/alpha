import listeners from 'app/settings/listeners';
import { getSettings } from 'app/settings';
import { execCommand } from 'app/keymaps/commands';
import { sessions, setSession } from 'app/common/process';

import store from '.';
import {
  addProcess,
  setProcessData,
  clearProcessData,
} from './actions/process';
import {
  requestTerminal,
  setTerminalOptions,
  disposeTerminal,
} from './actions/terminal';
import { nextTab, previousTab, specificTab } from './actions/tab';
import { setMenu } from './actions/window';

export default () => {
  global.on('terminal-create', ({ current }) => {
    store.dispatch(requestTerminal(current));
  });

  global.on('terminal-request', ({ current, profile }) => {
    const { session, options } = setSession(profile);

    sessions.set(options.id, session);

    global.emit('process-add', {
      id: options.id,
      shell: options.shell,
      current,
    });

    session.on('data', ({ id, data }) => {
      global.emit('process-set-data', { id, data });
    });

    session.on('kill', () => {
      const { id } = options;

      global.emit('terminal-delete', { id });

      sessions.delete(id);
    });
  });

  global.on('terminal-delete', ({ id }) => {
    store.dispatch(disposeTerminal(id, 'PROCESS_DELETE'));
  });

  global.on('process-add', ({ id, shell, current }) => {
    store.dispatch(addProcess(id, shell, current));
  });

  global.on('process-set-data', ({ id, data }) => {
    store.dispatch(setProcessData(id, data));
  });

  global.on('process-send-data', ({ id, data }) => {
    const session = sessions.get(id);

    if (session) {
      session.write(data);
    }
  });

  global.on('process-kill', ({ id }) => {
    const process = sessions.get(id);

    if (process) {
      process.kill();
    }
  });

  global.on('terminal-clear-buffer', () => {
    store.dispatch(clearProcessData());
  });

  global.on('terminal-dispose-current', () => {
    store.dispatch(disposeTerminal('current', 'PROCESS_KILL'));
  });

  global.on('terminal-open-settings', () => {
    store.dispatch(setMenu('Settings'));
  });

  global.on('profile-select', ({ profile }) => {
    store.dispatch(requestTerminal(undefined, profile));
  });

  global.on('tab-move-to-next', () => {
    store.dispatch(nextTab());
  });

  global.on('tab-move-to-previous', () => {
    store.dispatch(previousTab());
  });

  global.on('tab-move-to-specific', index => {
    store.dispatch(specificTab(index));
  });

  global.on('window-show-commands', () => {
    store.dispatch(setMenu('Commands'));
  });

  global.on('exec-command', command => {
    execCommand(command);
  });

  (() => {
    store.dispatch(setTerminalOptions(getSettings()));

    listeners.subscribe(() => {
      store.dispatch(setTerminalOptions(getSettings()));
    });

    listeners.watch();
  })();
};
