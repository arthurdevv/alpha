import * as chokidar from 'chokidar';
import { userPath, userKeymapsPath } from './constants';

export const handlers: Record<string, Function[]> = {
  options: [],
  keymaps: [],
};

const watchOptions: chokidar.WatchOptions = {
  atomic: true,
  persistent: true,
};

export const getWatcher = (path: string): chokidar.FSWatcher =>
  chokidar.watch(path, watchOptions);

function subscribe(key: string, callback: Function) {
  const handler = handlers[key];

  handler.push(callback);

  callback();

  const watcher = getWatcher(key === 'options' ? userPath : userKeymapsPath);

  watch(watcher, key);
}

function watch(watcher: chokidar.FSWatcher, key: string) {
  const listener = () => {
    const handler = handlers[key];

    handler.forEach(callback => {
      callback();
    });
  };

  watcher.on('change', listener);
}

export default { subscribe };
