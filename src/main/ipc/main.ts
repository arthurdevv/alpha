import { ipcMain } from 'electron';
import type { BrowserWindow } from 'glasstron';

import { BaseIPC } from 'shared/ipc';

export class IPCMain extends BaseIPC {
  constructor(private window: BrowserWindow) {
    super();

    ipcMain.on('main', (_, { channel, args }) => {
      this.emit(channel, ...args);
    });
  }

  send(channel: string, args?: any) {
    this.window.webContents.send('renderer', { channel, args });
  }

  handle(channel: string, listener: (args: any) => any | Promise<any>) {
    ipcMain.handle(channel, (_, args) => listener(args));
  }
}
