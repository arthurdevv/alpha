import { EventEmitter } from 'events';
import { ipcMain } from 'electron';
import { v4 as uuidv4 } from 'uuid';

class IPCMain {
  private emitter: EventEmitter;

  private id: string = uuidv4();

  constructor(public window: Alpha.BrowserWindow) {
    this.emitter = new EventEmitter();

    ipcMain.on(this.id, (_, { event, args }) => {
      this.emitter.emit(event, args);
    });

    window.webContents.on('did-finish-load', () => {
      window.webContents.send('ipc-start', this.id);
    });
  }

  on(event: string, listener: (...args: any[]) => void) {
    this.emitter.on(event, listener);
  }

  emit(event: string, ...args: any[]) {
    this.emitter.emit(event, ...args);
  }

  send(channel: string, args?: any) {
    this.window.webContents.send(this.id, { channel, args });
  }
}

export default IPCMain;
