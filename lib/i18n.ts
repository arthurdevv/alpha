import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { gettextToI18next } from 'i18next-conv';
import { join } from 'path';
import { readFileSync } from 'fs';
import { app } from '@electron/remote';
import { getSettings } from 'app/settings';
import { appPath } from 'app/settings/constants';

async function convertToJSON(language: string): Promise<NodeJS.Dict<string>> {
  if (language === 'en-US') return {};

  const localesPath = join(appPath, `locales/${language}.po`);

  const content = await gettextToI18next(language, readFileSync(localesPath));

  return JSON.parse(content);
}

export function getAutomaticLanguage(lng: string): string {
  return lng === 'auto' ? app.getLocale() : lng;
}

export async function changeLanguage(lng: string): Promise<void> {
  lng = getAutomaticLanguage(lng);

  const translation = await convertToJSON(lng);

  i18n.addResources(lng, 'translation', translation);

  await i18n.changeLanguage(lng);
}

let { language: lng } = getSettings();

lng = getAutomaticLanguage(lng) as IAppOptions['language'];

const translation = await convertToJSON(lng);

i18n.use(initReactI18next).init({
  lng,
  fallbackLng: 'en-US',
  resources: { [lng]: { translation } },
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
