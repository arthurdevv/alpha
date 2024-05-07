import { resolve } from 'path';
import { getWorkingDirectoryFromPID } from 'native-process-working-directory';
import createProcess, { processes } from 'app/common/process';
import { terms } from 'app/common/terminal';
import { getSettings } from 'app/settings';
import { getProfileByProp } from 'app/common/profiles';
import { execCommand, getKeymaps, mousetrap } from 'app/keymaps';
import { appDir } from 'app/settings/constants';
import listeners from 'app/settings/listeners';
import storage from 'app/utils/local-storage';

export default ({ getStore, setModal }: AlphaStore) => {
  const store = getStore();

  window.on('terminal:create', (profile?: IProfile) => {
    const { defaultProfile } = getSettings();

    const { name, title, options } =
      profile || getProfileByProp('name', defaultProfile);

    const process = createProcess(options);

    if (process) store.createTab(process, title ? name : undefined);
  });

  window.on('terminal:close', () => {
    const { current } = getStore();

    if (current) {
      const process = processes[current];

      process.pty.kill();

      store.onClose(current);
    }
  });

  window.on('terminal:focus', () => {
    const { current } = getStore();

    if (current) {
      const term = terms[current];

      if (term) term.focus();
    }
  });

  window.on('terminal:clear', () => {
    store.setCurrentClear();
  });

  window.on('terminal:settings', () => {
    store.createTab(null, 'Settings');

    setModal(undefined);
  });

  window.on('terminal:search', () => {
    const { context, current } = getStore();

    if (Object.keys(context).length >= 1 && current !== 'Settings') {
      setModal('Search');
    }
  });

  window.on('terminal:debug', () => {
    setModal('Debug');
  });

  window.on('terminal:commands', () => {
    setModal('Commands');
  });

  window.on('terminal:profiles', (click?: boolean) => {
    const { modal } = getStore();

    if (click) {
      return setModal('Profiles');
    }

    if (modal !== 'Profiles') {
      setTimeout(() => setModal('Profiles'), 100);
    }
  });

  window.on('terminal:save', () => {
    Object.entries(processes).forEach(([id, { pty }]) => {
      const cwd = getWorkingDirectoryFromPID(pty.pid);

      if (cwd) {
        processes[id].cwd = resolve(cwd);
      }
    });

    storage.updateItem('recovery', processes);
  });

  window.on('tab:next', () => {
    store.moveTo(1);
  });

  window.on('tab:previous', () => {
    store.moveTo(-1);
  });

  window.on('tab:specific', index => {
    store.moveTo(0, index);
  });

  listeners.subscribe('options', () => {
    store.setOptions(getSettings());

    ['opacity', 'always-on-top'].forEach(event => {
      window.send(`window:${event}`);
    });
  });

  listeners.subscribe('keymaps', () => {
    const keymaps = getKeymaps();

    mousetrap.reset().stopCallback = () => false;

    Object.keys(keymaps).forEach(command => {
      const keys = keymaps[command][0];

      mousetrap.bind(
        keys,
        event => {
          event.preventDefault();

          execCommand(command);
        },
        'keydown',
      );
    });
  });

  const { openOnStart, restoreOnStart } = getSettings();

  if (restoreOnStart) {
    const recovery = storage.parseItem('recovery');

    Object.entries(recovery).forEach(([, options]) => {
      const process = createProcess(options as IProcess);

      if (process) store.createTab(process);
    });
  }

  if (openOnStart || process.env.ALPHA_CLI || process.cwd() !== appDir) {
    setTimeout(() => execCommand('terminal:create'), 3700);
  }
};
