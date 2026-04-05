import path from 'node:path';

import { screen } from 'electron';

import type { Bounds } from 'main/types';
import { ConfigManager, userDataPath } from 'shared/config';
import { reportError } from 'shared/error-reporter';

const FILE = {
  JSON: path.join(userDataPath, 'bounds.json'),
  YAML: path.join(userDataPath, 'bounds.yaml'),
};

const initialBounds: Bounds = {
  width: 1050,
  height: 560,
};

class BoundsManager extends ConfigManager<Bounds, Bounds> {
  constructor() {
    super(FILE, null, initialBounds);
  }

  get(defaults?: boolean): Bounds {
    try {
      const bounds = defaults ? this.defaults : this.load();
      const { workAreaSize } = screen.getPrimaryDisplay();

      if (
        bounds.width > workAreaSize.width ||
        bounds.height > workAreaSize.height ||
        (bounds.x && bounds.x + bounds.width > workAreaSize.width) ||
        (bounds.y && bounds.y + bounds.height > workAreaSize.height)
      ) {
        return this.defaults;
      }

      return bounds;
    } catch (error) {
      reportError(error);
      return this.get(true);
    }
  }
}

export const bounds = new BoundsManager();
