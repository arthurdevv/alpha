import * as chokidar from 'chokidar';
import { userPath } from './constants';

const listeners: Function[] = [];

const watcher = chokidar.watch(userPath, {
  atomic: true,
  persistent: true,
});

function subscribe(callback: Function): () => void {
  callback();

  listeners.push(callback);

  return () => {
    listeners.splice(listeners.indexOf(callback), 1);
  };
}

function watch(): () => void {
  const listener = () => {
    listeners.forEach(callback => {
      callback();
    });
  };

  watcher.on('change', listener);

  return () => {
    watcher.removeListener('change', listener);
  };
}

export default { subscribe, watch };
