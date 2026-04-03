import { ipcRenderer } from 'electron';

import { BaseIPC } from 'shared/ipc';

export class IPCRenderer extends BaseIPC {
  constructor() {
    super();

    ipcRenderer.on('renderer', (_, { channel, args }) => {
      this.emit(channel, args);
    });
  }

  send(channel: string, ...args: any[]) {
    ipcRenderer.send('main', { channel, args });
  }

  invoke(channel: string, ...args: any[]) {
    return ipcRenderer.invoke(channel, args);
  }
}

export const ipc = new IPCRenderer();

export function subscribe(event: string, callback: (...args: any[]) => void) {
  const listener = (...args: any[]) => {
    callback(...args);
  };

  ipc.on(event, listener);

  return () => {
    ipc.removeListener(event, listener);
  };
}
