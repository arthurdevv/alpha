import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { app } from 'electron';

import { PATHS } from 'shared/config';
import { reportError } from 'shared/error-reporter';
import type { Theme } from 'shared/types';

export const resourcesPath = join(app.isPackaged ? PATHS.exe : PATHS.app, 'resources');

export function loadTheme(name: string): Partial<Theme | null> {
  try {
    const content = readFileSync(`${resourcesPath}\\themes\\${name}.json`, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    reportError(error);
    return {};
  }
}

export function listThemes(): string[] {
  try {
    const files = readdirSync(`${resourcesPath}\\themes`)
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace(/\.json$/, ''));

    return files;
  } catch (error) {
    reportError(error);
    return ['Default'];
  }
}
