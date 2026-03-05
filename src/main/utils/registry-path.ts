import * as Registry from 'native-reg';

const { HKCU, HKLM, Access } = Registry;

function getRegistryPath(subKey: string, valueName: string): string {
  const extsKey =
    Registry.openKey(HKLM, 'Software', Access.READ) ||
    Registry.openKey(HKCU, 'Software', Access.READ);

  const keyValue = extsKey
    ? Registry.getValue(extsKey, subKey, valueName)
    : null;

  Registry.closeKey(extsKey);

  return String(keyValue);
}

export default getRegistryPath;
