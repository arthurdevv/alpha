import { EventEmitter } from 'events';
import { ipcRenderer } from 'electron';

class IPCRenderer {
  private emitter: EventEmitter;

  private id!: string;

  constructor() {
    this.emitter = new EventEmitter();

    ipcRenderer.on('ipc-start', (_, id: string) => {
      this.id = id;

      ipcRenderer.on(id, (_, { channel, args }) => {
        this.emitter.emit(channel, args);
      });

      this.send('ipc-main-ready');
    });
  }

  on(event: string, listener: (...args: any[]) => void) {
    this.emitter.on(event, listener);
  }

  emit(event: string, ...args: any[]) {
    this.emitter.emit(event, ...args);
  }

  send(event: string, args?: any) {
    ipcRenderer.send(this.id, { event, args });
  }
}

export default new IPCRenderer();
