import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { reportError } from 'shared/error-reporter';

const localeMap: Record<string, string> = {
  de: 'de-DE',
  es: 'es-ES',
  fr: 'fr-FR',
  ja: 'ja-JP',
  ko: 'ko-KR',
  pt: 'pt-BR',
  ru: 'ru-RU',
  zh: 'zh-CN',
};

const supportedLocales = new Set<string>(Object.values(localeMap));

function normalizeLocale(locale: string): string {
  if (localeMap[locale]) return localeMap[locale];

  const [base] = locale.split('-');
  return localeMap[base] ?? 'en-US';
}

async function resolveSystemLanguage(): Promise<string> {
  const preferred = await ipc.i18n.getPreferredSystemLanguages();

  for (const lng of preferred) {
    const normalized = normalizeLocale(lng);

    if (supportedLocales.has(normalized)) {
      return normalized;
    }
  }

  return 'en-US';
}

async function loadTranslation(lng: string) {
  let language: string;

  if (!lng || lng === 'auto') {
    language = await resolveSystemLanguage();
  } else {
    language = normalizeLocale(lng);
  }

  if (language === 'en-US') {
    return { translation: null, language };
  }

  const translation = await ipc.i18n.loadTranslation(language);
  return { translation, language };
}

export async function changeLanguage(lng: string): Promise<void> {
  const { translation, language } = await loadTranslation(lng);
  if (!translation) return;

  i18n.addResourceBundle(language, 'translation', translation, true, true);

  try {
    await i18n.changeLanguage(language);
  } catch (error) {
    reportError(error);
  }
}

export async function setupI18n() {
  const language = await ipc.settings.pick('language');
  const { translation } = await loadTranslation(language);
  if (!translation) return;

  await i18n.use(initReactI18next).init({
    lng: language,
    fallbackLng: 'en-US',
    resources: {
      [language]: { translation },
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  return i18n;
}

export default i18n;
