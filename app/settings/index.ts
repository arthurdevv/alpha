import yaml from 'js-yaml';
import { isEqual } from 'lodash';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { settingsPath, userSettingsPath } from './constants';

function loadSettings(initial?: boolean, raw = false): IRawSettings {
  let settings = <IRawSettings>{};

  try {
    const content = readFileSync(
      initial ? settingsPath : userSettingsPath,
      'utf-8',
    );

    if (raw) return content as any;

    settings = yaml.load(content) as typeof settings;
  } catch (error) {
    console.error(error);
  }

  return settings;
}

function writeSettings(
  settings: string | IRawSettings,
  callback?: Function,
): void {
  if (typeof settings === 'string') {
    settings = <IRawSettings>yaml.load(settings);
  }

  const validation = validateSettings(settings, loadSettings(true));

  if (validation) {
    try {
      const content = yaml.dump(settings, { indent: 2 });

      writeFileSync(userSettingsPath, content, 'utf-8');
    } catch (error) {
      console.error(error);
    }

    callback && callback();
  } else {
    console.error(
      'Invalid config detected. Ensure that all properties are properly defined.',
    );
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

function validateSettings(target: IRawSettings, source: IRawSettings): boolean {
  let validation: boolean = true;

  Object.keys(source).forEach(key => {
    if (Array.isArray(source[key]) || !target) return;

    if (typeof source[key] === 'object' && source[key] !== null) {
      if (
        !Object.prototype.hasOwnProperty.call(target, key) ||
        typeof target[key] !== 'object'
      ) {
        validation = false;
      }
      if (!validateSettings(target[key], source[key])) {
        validation = false;
      }
    } else if (!Object.prototype.hasOwnProperty.call(target, key)) {
      validation = false;
    }
  });

  return validation;
}

if (!existsSync(userSettingsPath)) {
  writeSettings(loadSettings(true));
} else {
  const [initial, current] = [loadSettings(true), loadSettings()];

  const mergedSettings = mergeSettings(current, initial);

  if (!isEqual(current, mergedSettings)) writeSettings(mergedSettings);
}

export { getSettings, setSettings, loadSettings, writeSettings };
