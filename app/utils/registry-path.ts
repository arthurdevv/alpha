import * as Registry from 'native-reg';

function getRegistryPath(subKey: string, valueName: string) {
  const extsKey =
    Registry.openKey(Registry.HKLM, 'Software', Registry.Access.READ) ||
    Registry.openKey(Registry.HKCU, 'Software', Registry.Access.READ);

  const keyValue = extsKey
    ? Registry.getValue(extsKey, subKey, valueName)
    : null;

  Registry.closeKey(extsKey);

  return String(keyValue);
}

export default getRegistryPath;
