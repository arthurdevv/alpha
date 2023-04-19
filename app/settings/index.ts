import yaml from 'js-yaml';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { userPath, defaultPath } from './constants';

function loadSettings(_default?: boolean | undefined): IRawSettings {
  let settings = <IRawSettings>{};

  try {
    const content = readFileSync(_default ? defaultPath : userPath, 'utf-8');

    settings = yaml.load(content, {
      schema: yaml.DEFAULT_SCHEMA,
    }) as typeof settings;
  } catch (error) {
    console.log(error);
  }

  return settings;
}

function writeSettings(settings: IRawSettings): void {
  try {
    const content = yaml
      .dump(settings, {
        indent: 2,
        schema: yaml.DEFAULT_SCHEMA,
      })
      .replace(/\r\n/g, global.isWin ? '\r\n' : '\n');

    writeFileSync(userPath, content, 'utf-8');
  } catch (error) {
    console.log(error);
  }
}

const getSettings = (_default?: boolean | undefined): ISettings => {
  const content = loadSettings(_default);

  const settings = <ISettings>{};

  Object.keys(content).forEach(key => {
    const context = content[key];

    Object.keys(context).forEach(subkey => {
      settings[subkey] = context[subkey];
    });
  });

  return settings;
};

const setSettings = (key: keyof ISettings, value: any): void => {
  const settings = loadSettings();

  Object.keys(settings).forEach(context => {
    const schema = settings[context];

    if (key in schema) {
      settings[context][key] = value;
    }
  });

  writeSettings(settings);
};

(() => {
  if (!existsSync(userPath)) {
    writeSettings(loadSettings(true));
  }
})();

export { getSettings, setSettings };
