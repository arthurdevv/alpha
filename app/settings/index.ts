import yaml from 'js-yaml';
import { isEqual } from 'lodash';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { settingsPath, userSettingsPath } from './constants';

function loadSettings(initial?: boolean): IRawSettings {
  let settings = <IRawSettings>{};

  try {
    const content = readFileSync(
      initial ? settingsPath : userSettingsPath,
      'utf-8',
    );

    settings = yaml.load(content) as typeof settings;
  } catch (error) {
    console.log(error);
  }

  return settings;
}

function writeSettings(settings: IRawSettings): void {
  try {
    const content = yaml.dump(settings, { indent: 2 });

    writeFileSync(userSettingsPath, content, 'utf-8');
  } catch (error) {
    console.log(error);
  }
}

function getSettings(initial?: boolean): ISettings {
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
}

function setSettings(key: keyof ISettings, value: any, callback?: Function) {
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
}

function mergeSettings(current: IRawSettings, initial: IRawSettings) {
  const result = <IRawSettings>{ ...current };

  Object.keys(initial).forEach(key => {
    const hasProperty = Object.prototype.hasOwnProperty.call(current, key);

    if (!hasProperty || current[key] === undefined) {
      result[key] = initial[key];
    } else if (
      typeof current[key] === 'object' &&
      !Array.isArray(current[key])
    ) {
      result[key] = mergeSettings(current[key], initial[key]);
    }
  });

  return result;
}

if (!existsSync(userSettingsPath)) {
  writeSettings(loadSettings(true));
} else {
  const [initial, current] = [loadSettings(true), loadSettings()];

  const mergedSettings = mergeSettings(current, initial);

  if (!isEqual(current, mergedSettings)) writeSettings(mergedSettings);
}

export { getSettings, setSettings };
