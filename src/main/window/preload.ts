import { contextBridge } from 'electron';

import { version } from 'main/../../package.json';
import { ipc, subscribe } from 'main/ipc/renderer';
import type { IpcAPI } from 'shared/types';

const api: IpcAPI = {
  app: {
    version,
    isPackaged: () => ipc.invoke('app:is-packaged'),
  },

  settings: {
    load: () => ipc.invoke('settings:load'),
    get: () => ipc.invoke('settings:get'),
    pick: key => ipc.invoke('settings:pick', key),
    save: value => ipc.send('settings:save', value),
    reset: (scope, key) => ipc.send('settings:reset', scope, key),
  },

  keymaps: {
    load: () => ipc.invoke('keymaps:load'),
    save: value => ipc.send('keymaps:save', value),
    reset: command => ipc.send('keymaps:reset', command),
  },

  theme: {
    load: name => ipc.invoke('theme:load', name),
    list: () => ipc.invoke('theme:list'),
  },

  window: {
    action: (action, ...args) => ipc.send('window:action', action, ...args),
  },

  system: {
    info: () => ipc.invoke('system:info'),
  },

  i18n: {
    getPreferredSystemLanguages: () => ipc.invoke('i18n:get-preferred-system-languages'),
    loadTranslation: lng => ipc.invoke('i18n:load-translation', lng),
  },

  subscribe,
};

contextBridge.exposeInMainWorld('ipc', api);
