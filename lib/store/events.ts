import createProcess from 'app/common/process';
import { terms } from 'app/common/terminal';
import { getSettings } from 'app/settings';
import { getShellArgs } from 'app/common/profiles';
import { mousetrap, getKeymaps, execCommand } from 'app/keymaps';
import { userPath, userKeymapsPath, appDir } from 'app/settings/constants';
import listeners, { getWatcher } from 'app/settings/listeners';
import defaultShell from 'app/utils/default-shell';

export default ({ getState, setMenu }: AlphaStore) => {
  const store = getState();

  window.on('terminal:create', (profile: IProfile) => {
    const { shell, cwd, useConpty } = getSettings();

    const process = createProcess(
      profile || {
        shell: shell || defaultShell,
        args: getShellArgs(shell),
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
      store.onClose(current);
    }
  });

  window.on('terminal:focus', () => {
    const { current } = getState();

    if (current) {
      const term = terms[current];

      if (term) {
        term.focus();
      }
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

  window.on('terminal:search', () => {
    const { context } = getState();

    if (Object.keys(context).length >= 1) {
      setMenu('Search');
    }
  });

  window.on('terminal:commands', () => {
    setMenu('Commands');
  });

  window.on('terminal:profiles', () => {
    const { menu } = getState();

    if (menu !== 'Profiles') {
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

  listeners
    .subscribe('options', () => {
      store.setOptions(getSettings());
    })
    .watch(getWatcher(userPath), 'options');

  listeners
    .subscribe('keymaps', () => {
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
    })
    .watch(getWatcher(userKeymapsPath), 'keymaps');

  const { openOnStart } = getSettings();

  if (openOnStart || process.env.ALPHA_CLI || process.cwd() !== appDir) {
    setTimeout(() => execCommand('terminal:create'), 3700);
  }
};
