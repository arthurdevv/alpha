import yaml from 'js-yaml';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { userPath, defaultPath } from './constants';

function loadSettings(initial?: boolean): IRawSettings {
  let settings = <IRawSettings>{};

  try {
    const content = readFileSync(initial ? defaultPath : userPath, 'utf-8');

    settings = yaml.load(content) as typeof settings;
  } catch (error) {
    console.log(error);
  }

  return settings;
}

function writeSettings(settings: IRawSettings): void {
  try {
    const content = yaml.dump(settings, { indent: 2 });

    writeFileSync(userPath, content, 'utf-8');
  } catch (error) {
    console.log(error);
  }
}

const getSettings = (initial?: boolean): ISettings => {
  const content = loadSettings(initial);

  const settings = <ISettings>{};

  Object.entries(content).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      settings[key] = value;
    } else {
      Object.keys(value).forEach(subkey => {
        settings[subkey] = value[subkey];
      });
    }
  });

  return settings;
};

const setSettings = (
  key: keyof ISettings,
  value: any,
  callback?: Function,
): void => {
  const settings = loadSettings();

  if (key in settings) {
    settings[key] = value;
  } else {
    Object.entries(settings).forEach(([context, schema]) => {
      if (key in schema) {
        settings[context][key] = value;
      }
    });
  }

  writeSettings(settings);

  callback && callback();
};

const hasSettingsFile = existsSync(userPath);

if (!hasSettingsFile) {
  const initialSettings = loadSettings(true);

  writeSettings(initialSettings);
}

export { getSettings, setSettings };
