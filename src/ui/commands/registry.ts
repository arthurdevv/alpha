import type { Instance, Profile } from 'shared/types';
import { getAppState } from 'ui/store/app/store';
import { getTermsState } from 'ui/store/terms/store';
import type { TermsState, TermsStore } from 'ui/store/terms/types';
import { capitalizeFirstLetter } from 'ui/utils/misc';

function createInstance(): Instance {
  return {
    id: crypto.randomUUID(),
    title: 'Terminal',
    isExpanded: false,
    isConnected: false,
    hasCustomTitle: false,
    profile: {
      id: crypto.randomUUID(),
      group: 'Ungrouped',
      name: 'Profile 1',
      type: 'shell',
      useNameAsTitle: false,
      options: { file: 'cmd.exe', args: [], cwd: 'c:/', env: {} },
    },
  };
}

function getCurrentFocused({ origin, focused }: TermsState) {
  if (!origin) return null;
  return { origin, focused: focused[origin][0] };
}

interface Registry {
  'app:modal': (value: string) => void;
  'app:settings': () => void;
  'connection:action': (action: string) => void;
  'pane:create': (id: UUID, instance: Instance, orientation: 'horizontal' | 'vertical') => void;
  'pane:action': (action: 'broadcast' | 'collapse' | 'expand') => void;
  'pane:focus': (order: 'next' | 'previous') => void;
  'pane:split': (
    id: UUID,
    instance: Instance,
    orientation: 'horizontal' | 'vertical',
  ) => Promise<void>;
  'pane:resize': (direction: 'up' | 'right' | 'down' | 'left') => void;
  'process:action': (action: string) => void;
  'tab:action': (action: 'color' | 'duplicate' | 'rename' | 'reopen-closed') => void;
  'tab:navigate': (order: 'next' | 'previous') => void;
  'terminal:request': (instance: Instance) => void;
  'terminal:action': (
    action: 'clear' | 'copy' | 'focus' | 'paste' | 'select-all' | 'write',
  ) => void;
  'terminal:modal': (value: string) => void;
}

let count = 0;

export const registry: Registry = {
  'app:modal': value => {
    const { modal, setModal } = getAppState();

    value = capitalizeFirstLetter(value);

    if (modal === value) {
      // if (value === 'Keymaps') global.handleModal(undefined, null);
      return;
    }

    if (modal) {
      // global.handleModal(undefined, value);
    } else {
      setModal(value);
    }
  },

  'app:settings': () => {
    const { createTab } = getTermsState();
    createTab('Settings', 'settings');
  },

  'connection:action': action => {}, // TODO

  'pane:create': (id, instance, orientation) => {
    const { splitTerm } = getTermsState();
    splitTerm(id, instance, orientation);
  },

  'pane:action': action => {}, // TODO

  'pane:focus': order => {
    const { origin, focused, switchTerm } = getTermsState();
    if (!origin) return;

    const [current] = focused[origin];
    switchTerm(current, order, true);
  },

  'pane:split': async (id, instance, orientation) => {}, // TODO

  'pane:resize': direction => {
    const { origin, focused, resizeTerm } = getTermsState();
    if (!origin) return;

    const [current] = focused[origin];
    resizeTerm(current, direction);
  },

  'process:action': action => {}, // TODO

  'tab:action': action => {
    const { origin, duplicateTab } = getTermsState();
    if (!origin) return;

    if (action === 'duplicate') {
      duplicateTab(origin);
      return;
    } else if (action === 'reopen-closed') {
      // TODO
      return;
    }

    executeCommand('app:modal', action);
  },

  'tab:navigate': order => {
    const { origin, switchTerm } = getTermsState();
    if (!origin) return;

    switchTerm(origin, order);
  },

  'terminal:request': instance => {
    const { requestTerm, createTab } = getTermsState();

    count += 1;

    const ins: Instance = {
      id: `pid-${count}`,
      title: `Terminal ${count}`,
      isExpanded: false,
      isConnected: false,
      hasCustomTitle: false,
      profile: {
        id: 'cmd',
        group: 'Ungrouped',
        name: 'Command Prompt',
        type: 'shell',
        useNameAsTitle: false,
        options: { file: 'cmd.exe', args: [], cwd: 'c:/', env: {} },
      },
    };

    // requestTerm(ins, true);

    createTab(`Terminal ${count}`, 'terminal');
  },

  'terminal:action': action => {}, // TODO

  'terminal:modal': value => {}, // TODO
};

export function executeCommand(command: string, ...args: any[]) {
  registry[command]?.(...args);
}
