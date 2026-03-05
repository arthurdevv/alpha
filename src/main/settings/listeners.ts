import * as chokidar from 'chokidar';
import { useEffect, useState } from 'preact/hooks';
import { userKeymapsPath, userSettingsPath } from './constants';
import { getSettings } from '.';

const watchers: Record<string, chokidar.FSWatcher | null> = {
  options: null,
  keymaps: null,
};

const handlers: Record<string, Function[]> = {
  options: [],
  keymaps: [],
};

function watch(watcher: chokidar.FSWatcher, key: string) {
  const listener = () => {
    const handler = handlers[key];

    handler.forEach(callback => {
      callback();
    });
  };

  watcher.on('change', listener);
}

function subscribe(key: string, callback: Function) {
  const handler = handlers[key];

  handler.push(callback);

  callback();

  if (!watchers[key]) {
    const path = key === 'options' ? userSettingsPath : userKeymapsPath;

    const watcher = chokidar.watch(path, {
      atomic: true,
      persistent: true,
    });

    watch(watcher, key);

    watchers[key] = watcher;
  }

  return {
    subscribe,
    unsubscribe: () => {
      const index = handler.indexOf(callback);

      if (index !== -1) handler.splice(index, 1);
    },
  };
}

export function useSettings(): [
  ISettings,
  <T extends keyof ISettings>(key: T, value: ISettings[T]) => void,
] {
  const [settings, setSettings] = useState<ISettings>(() => getSettings());

  useEffect(() => {
    const { unsubscribe } = subscribe('options', () => {
      setSettings(getSettings());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const updateSettings = <T extends keyof ISettings>(
    key: T,
    value: ISettings[T],
  ) => setSettings({ ...settings, [key]: value });

  return [settings, updateSettings];
}

export default { subscribe };
