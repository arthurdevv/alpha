import { readdirSync, readFileSync } from 'node:fs';

import { resourcesPath } from 'main/settings/constants';
import { changeOpacity, darkenHex } from 'main/utils/color-utils';
import { reportError } from 'shared/error-reporter';
import type { Settings, ITheme } from 'shared/types';

function loadTheme(name: any): ITheme {
  let theme = <ITheme>{};

  try {
    const content = readFileSync(
      `${resourcesPath}\\themes\\${name}.json`,
      'utf-8',
    );

    theme = JSON.parse(content);
    theme['cursor'] = theme['cursorColor'];

    if (theme.name !== 'default') delete theme['name'];
    delete theme['cursorColor'];
  } catch (error) {
    reportError(error);
  }

  return theme;
}

function listThemes(lowercase = false): string[] {
  let themes: string[] = ['Default'];

  try {
    const content = readdirSync(`${resourcesPath}\\themes`).filter(file =>
      file.endsWith('.json'),
    );

    themes = themes.concat(content).map(file => {
      file = file.replace(/\.json$/, '');

      return lowercase ? file.toLowerCase() : file;
    });
  } catch (error) {
    reportError(error);
  }

  return themes.filter(t => t !== 'undefined');
}

function setThemeVariables(
  theme: ITheme | string | undefined,
  { preserveBackground, acrylic }: Settings,
): void {
  if (!theme || typeof theme === 'string') {
    theme = loadTheme(theme);
  }

  if (theme.name === 'default') return;

  const root = document.documentElement;

  const variables = { foreground: 'foreground' };

  if (preserveBackground) {
    ['--background', '--header', '--indicator'].forEach(value => {
      root.style.removeProperty(value);
    });
  } else {
    variables['background'] = 'background';
    variables['header'] = 'background';
    variables['indicator'] = 'selectionBackground';
  }

  if (acrylic) variables['acrylic'] = 'background';

  Object.entries(variables).forEach(([value, key]) => {
    let color = theme[key];

    switch (value) {
      case 'acrylic':
        color = changeOpacity(theme[key], 0.7);
        break;

      case 'header':
        color = darkenHex(theme[key], 5);
        if (acrylic) color = changeOpacity(color, 0.7);

        break;

      case 'indicator':
        color = theme[key];
        break;
    }

    root.style.setProperty(`--${value}`, color);
  });
}

function removeThemeVariables() {
  const root = document.documentElement;

  ['--foreground', '--background', '--acrylic', '--header'].forEach(
    variable => {
      root.style.removeProperty(variable);
    },
  );
}

export { loadTheme, listThemes, setThemeVariables, removeThemeVariables };
