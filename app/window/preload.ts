import EventEmitter from 'events';
import { ipcRenderer } from 'electron';

const ipc = new EventEmitter();

const GLOBAL = {
  isMac: process.platform === 'darwin',

  isWin: process.platform === 'win32',

  on(eventName: string, listener: (...args: any[]) => void) {
    return ipc.on(eventName, listener);
  },

  emit(eventName: string, ...args: any[]) {
    return ipc.emit(eventName, ...args);
  },

  send(channel: string, ...args: any[]) {
    return ipcRenderer.send(channel, ...args);
  },
} as const;

Object.keys(GLOBAL).forEach(key => {
  window[key] = GLOBAL[key];
});
