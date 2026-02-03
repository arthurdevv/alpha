import yaml from 'js-yaml';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import {
  appVersion,
  settingsPath,
  userSettingsPath,
} from 'app/settings/constants';
import { reportError } from 'shared/error-reporter';

function loadSettings(defaults?: boolean, raw = false): IRawSettings {
  let settings = <IRawSettings>{};

  try {
    const content = readFileSync(
      defaults ? settingsPath : userSettingsPath,
      'utf-8',
    );

    if (raw) return content as any;

    settings = yaml.load(content) as typeof settings;
  } catch (error) {
    reportError(error);
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

  const validation = validateSettings(settings, defaultSettings);

  if (!validation) {
    settings = mergeMissingSettings(defaultSettings, settings);
  }

  try {
    const content = yaml.dump(settings, { indent: 2 });

    writeFileSync(userSettingsPath, content, 'utf-8');
  } catch (error) {
    reportError(error);
  }

  callback && callback();
}

function getSettings(defaults?: boolean): ISettings {
  const content = loadSettings(defaults);

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
    Object.entries(settings).forEach(([tag, schema]) => {
      if (key in schema) settings[tag][key] = value;
    });
  }

  writeSettings(settings);

  callback && callback();
}

function validateSettings(defaults: IRawSettings, current: IRawSettings) {
  if (
    typeof defaults !== 'object' ||
    typeof current !== 'object' ||
    defaults === null ||
    current === null
  ) {
    return typeof defaults === typeof current;
  }

  const keys1 = Object.keys(defaults);
  const keys2 = Object.keys(current);

  if (keys1.length !== keys2.length) return false;

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;

    if (!validateSettings(defaults[key], current[key])) return false;
  }

  return true;
}

function mergeMissingSettings(
  defaults: IRawSettings,
  current: IRawSettings,
): IRawSettings {
  return Object.keys(defaults).reduce(
    (result, key) => {
      const defaultValue = defaults[key];
      const userValue = current?.[key];

      if (userValue === undefined) {
        result[key] = defaultValue;

        return result;
      }

      if (
        typeof defaultValue === 'object' &&
        defaultValue !== null &&
        !Array.isArray(defaultValue)
      ) {
        result[key] = mergeMissingSettings(defaultValue, userValue);

        return result;
      }

      result[key] = userValue;

      return result;
    },
    { ...current },
  );
}

const [defaultSettings, currentSettings] = [loadSettings(true), loadSettings()];

if (!existsSync(userSettingsPath)) writeSettings(defaultSettings);
else if (currentSettings.application.version !== appVersion) {
  const validation = validateSettings(currentSettings, defaultSettings);

  if (!validation) {
    const migratedSettings = mergeMissingSettings(
      defaultSettings,
      currentSettings,
    );

    migratedSettings.application.version = appVersion;

    writeSettings(migratedSettings);
  }
}

export { getSettings, setSettings, loadSettings, writeSettings };

export default getSettings();
