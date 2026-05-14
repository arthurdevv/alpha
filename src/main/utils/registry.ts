import * as Registry from 'native-reg';

import { reportError } from 'shared/error-reporter';

export function getRegistryPath(subKey: string, valueName: string): string | null {
  const { HKCU, HKLM, Access } = Registry;

  const key =
    Registry.openKey(HKLM, 'Software', Access.READ) ??
    Registry.openKey(HKCU, 'Software', Access.READ);

  if (!key) return null;

  try {
    const value = Registry.getValue(key, subKey, valueName);
    return value ? String(value) : null;
  } catch (error) {
    reportError(error);
  } finally {
    Registry.closeKey(key);
  }

  return null;
}
