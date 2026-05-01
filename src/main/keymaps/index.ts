import path from 'node:path';

import { ConfigManager, PATHS } from 'shared/config';
import type { Keymaps } from 'shared/types';

import { defaultKeymaps, schema } from './defaults';

const FILE = {
  JSON: path.join(PATHS.userData, 'keymaps.json'),
  YAML: path.join(PATHS.userData, 'keymaps.yaml'),
};

class KeymapsManager extends ConfigManager<Keymaps, Keymaps> {
  constructor() {
    super(FILE, schema, defaultKeymaps());
  }

  get() {
    return {};
  }

  reset(command: string): void {
    const current = this.load();
    current[command] = this.defaults[command];

    this.save(current);
  }
}

export const keymaps = new KeymapsManager();
