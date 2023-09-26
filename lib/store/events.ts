import createProcess, { processes } from 'app/common/process';
import { terms } from 'app/common/terminal';
import { execCommand } from 'app/keymaps';
import { getSettings } from 'app/settings';
import listeners from 'app/settings/listeners';
import defaultShell from 'app/utils/default-shell';

export default (getState: () => AlphaStore, setMenu: AlphaStore['setMenu']) => {
  const store = getState();

  window.on('terminal:create', (profile: IProfile) => {
    const { cwd, useConpty } = getSettings();

    const process = createProcess(
      profile || {
        shell: defaultShell,
        args: [],
      },
      {
        cwd,
        useConpty,
      },
    );

    store.createTab(process);
  });

  window.on('terminal:close', () => {
    const { current } = getState();

    if (current) {
      const process = processes[current];

      if (process) {
        process.kill();
      }

      processes[current] = null;

      store.onClose(current);
    }
  });

  window.on('terminal:focus', () => {
    const { current } = getState();

    const term = terms[current!];

    if (term) {
      term.focus();
    }
  });

  window.on('terminal:clear', () => {
    store.setCurrentClear();
  });

  window.on('terminal:settings', () => {
    store.createTab(
      {
        process: null,
        shell: null,
      },
      false,
    );
  });

  window.on('terminal:commands', () => {
    setMenu('Commands');
  });

  window.on('terminal:profiles', () => {
    const { menu } = getState();

    if (menu === 'Commands') {
      setTimeout(() => {
        setMenu('Profiles');
      }, 100);
    } else {
      setMenu('Profiles');
    }
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

  listeners.subscribe(() => {
    store.setOptions(getSettings());
  });

  listeners.watch();

  const { openOnStart } = getSettings();

  if (openOnStart) {
    setTimeout(() => execCommand('terminal:create'), 3200);
  }
};
