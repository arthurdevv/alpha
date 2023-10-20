import * as chokidar from 'chokidar';

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
  callback();

  const handler = handlers[key];

  handler.push(callback);

  return { watch };
}

function watch(watcher: chokidar.FSWatcher, key: string) {
  const listener = () => {
    const handler = handlers[key];

    handler.forEach(callback => {
      callback();
    });
  };

  watcher.on('change', listener);

  return () => {
    watcher.removeListener('change', listener);
  };
}

export default { subscribe, watch };
