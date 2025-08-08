import { EventEmitter } from 'events';
import { ipcRenderer } from 'electron';
import { delay } from 'lodash';

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

      delay(event => this.emit(event), 3900, 'app:renderer-ready');
    });

    ipcRenderer.on('second-instance', (_, args) => {
      this.emit('app:second-instance', args);
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
