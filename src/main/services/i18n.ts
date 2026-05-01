import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { gettextToI18next } from 'i18next-conv';

import { PATHS } from 'shared/config';
import { reportError } from 'shared/error-reporter';

const cache = new Map<string, any>();

export async function loadTranslation(lng: string): Promise<Record<string, any>> {
  if (cache.has(lng)) return cache.get(lng);

  if (lng === 'en-US') {
    cache.set(lng, {});
    return {};
  }

  const filePath = join(PATHS.app, `locales/${lng}.po`);

  try {
    const content = await gettextToI18next(lng, readFileSync(filePath));
    const translation = JSON.parse(content);

    cache.set(lng, translation);
    return translation;
  } catch (error) {
    reportError(error);
  }

  return {};
}
