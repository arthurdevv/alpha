import path from 'node:path';

import { ConfigManager, userDataPath } from 'shared/config';
import type { Keymaps } from 'shared/types';

import { defaultKeymaps, schema } from './defaults';

const FILE = {
  JSON: path.join(userDataPath, 'keymaps.json'),
  YAML: path.join(userDataPath, 'keymaps.yaml'),
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
