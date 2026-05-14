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
    console.log(content);
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

// function setThemeVariables(
//   theme: Theme | string | undefined,
//   { preserveBackground, acrylic }: Settings,
// ): void {
//   if (!theme || typeof theme === 'string') {
//     theme = loadTheme(theme);
//   }

//   if (theme.name === 'default') return;

//   const root = document.documentElement;

//   const variables = { foreground: 'foreground' };

//   if (preserveBackground) {
//     ['--background', '--header', '--indicator'].forEach(value => {
//       root.style.removeProperty(value);
//     });
//   } else {
//     variables['background'] = 'background';
//     variables['header'] = 'background';
//     variables['indicator'] = 'selectionBackground';
//   }

//   if (acrylic) variables['acrylic'] = 'background';

//   Object.entries(variables).forEach(([value, key]) => {
//     let color = theme[key];

//     switch (value) {
//       case 'acrylic':
//         color = changeOpacity(theme[key], 0.7);
//         break;

//       case 'header':
//         color = darkenHex(theme[key], 5);
//         if (acrylic) color = changeOpacity(color, 0.7);

//         break;

//       case 'indicator':
//         color = theme[key];
//         break;
//     }

//     root.style.setProperty(`--${value}`, color);
//   });
// }

// function removeThemeVariables() {
//   const root = document.documentElement;

//   ['--foreground', '--background', '--acrylic', '--header'].forEach(variable => {
//     root.style.removeProperty(variable);
//   });
// }
