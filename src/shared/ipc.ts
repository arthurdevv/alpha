import EventEmitter from 'node:events';

export abstract class BaseIPC {
  protected emitter = new EventEmitter();

  on(event: string, listener: (...args: any[]) => void) {
    this.emitter.on(event, listener);
    return this;
  }

  emit(event: string, ...args: any[]) {
    this.emitter.emit(event, ...args);
    return this;
  }

  removeListener(event: string, listener: (...args: any[]) => void) {
    this.emitter.removeListener(event, listener);
    return this;
  }

  removeAllListeners(event: string) {
    this.emitter.removeAllListeners(event);
    return this;
  }

  abstract send<T>(channel: string, args?: T): void;
}
