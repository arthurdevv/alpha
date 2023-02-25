import { EventEmitter } from 'events';
import { ipcRenderer } from 'electron';

const eventEmitter = new EventEmitter();

global.on = eventEmitter.on;

global.emit = eventEmitter.emit;

global.send = ipcRenderer.send;

global.isWin = process.platform === 'win32';

global.isMac = process.platform === 'darwin';
