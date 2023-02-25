import * as chokidar from 'chokidar';
import { userPath } from './constants';

const listeners: Function[] = [];

const watcher = chokidar.watch(userPath, {
  atomic: true,
  persistent: true,
});

function subscribe(callback: Function): () => void {
  listeners.push(callback);

  return () => {
    listeners.splice(listeners.indexOf(callback), 1);
  };
}

function watch(): void {
  const onChange = () => {
    setTimeout(() => {
      listeners.forEach(callback => {
        callback();
      });
    }, 100);
  };

  watcher.on('change', onChange);
}

export default { subscribe, watch };
