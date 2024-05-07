import EventEmitter from 'events';
import { ipcRenderer } from 'electron';

const emitter = new EventEmitter();

const ipc = {
  on(eventName: string, listener: (...args: any[]) => void) {
    return emitter.on(eventName, listener);
  },

  emit(eventName: string, ...args: any[]) {
    return emitter.emit(eventName, ...args);
  },

  send(channel: string, ...args: any[]) {
    return ipcRenderer.send(channel, ...args);
  },
} as const;

Object.keys(ipc).forEach(key => {
  window[key] = ipc[key];
});
