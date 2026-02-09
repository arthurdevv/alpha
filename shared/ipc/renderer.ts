import { EventEmitter } from 'events';
import { ipcRenderer } from 'electron';

class IPCRenderer {
  private emitter: EventEmitter;

  private id!: string;

  constructor() {
    this.emitter = new EventEmitter();

    ipcRenderer.on('app:start', (_, id: string) => {
      this.id = id;

      ipcRenderer.on(id, (_, { channel, args }) => {
        this.emitter.emit(channel, args);
      });

      setTimeout(() => this.emit('app:renderer-ready'), 3900);
    });

    ipcRenderer.on('second-instance', (_, args) => {
      this.emit('app:second-instance', args);
    });
  }

  on(event: string, listener: (...args: any[]) => void) {
    return this.emitter.on(event, listener);
  }

  emit(event: string, ...args: any[]) {
    this.emitter.emit(event, ...args);
  }

  send(event: string, args?: any) {
    ipcRenderer.send(this.id, { event, args });
  }

  removeAllListeners(event: string) {
    return this.emitter.removeAllListeners(event);
  }
}

export default new IPCRenderer();
