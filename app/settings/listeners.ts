import * as chokidar from 'chokidar';
import { userKeymapsPath, userSettingsPath } from './constants';

export const handlers: Record<string, Function[]> = {
  options: [],
  keymaps: [],
};

function subscribe(key: string, callback: Function) {
  const handler = handlers[key];

  handler.push(callback);

  callback();

  const watcher = chokidar.watch(
    key === 'options' ? userSettingsPath : userKeymapsPath,
    { atomic: true, persistent: true },
  );

  watch(watcher, key);

  return { subscribe };
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
