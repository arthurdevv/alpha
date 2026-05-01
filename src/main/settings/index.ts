import path from 'node:path';

import { ConfigManager, PATHS } from 'shared/config';
import { reportError } from 'shared/error-reporter';
import type { FlatSettings, Settings, SettingsFields } from 'shared/types';

import { defaultSettings, schema } from './defaults';

const FILE = {
  JSON: path.join(PATHS.userData, 'settings.json'),
  YAML: path.join(PATHS.userData, '.alpha.yaml'),
};

class SettingsManager extends ConfigManager<Settings, FlatSettings> {
  constructor() {
    super(FILE, schema, defaultSettings());
  }

  get(defaults = false): FlatSettings {
    try {
      const settings = defaults ? this.defaults : this.load();

      return {
        ...settings.application,
        ...settings.appearance,
        ...settings.terminal,
        ...settings.window,
        profiles: settings.profiles,
        workspaces: settings.workspaces,
      };
    } catch (error) {
      reportError(error);
      return this.get(true);
    }
  }

  pick<T extends keyof FlatSettings>(key: T): FlatSettings[T] {
    return this.get()[key];
  }

  reset<S extends keyof SettingsFields>(scope: S, key: keyof SettingsFields[S]): void {
    try {
      const current = this.load();
      current[scope][key] = this.defaults[scope][key];

      this.save(current);
    } catch (error) {
      reportError(error);
    }
  }
}

export const settings = new SettingsManager();
