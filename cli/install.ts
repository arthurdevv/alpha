// import { binPath, firstRunFlag } from 'main/settings/constants';
import * as Registry from 'native-reg';

import { exePath } from 'shared/config';
import { reportError } from 'shared/error-reporter';

const { HKCU, Access, ValueType } = Registry;

const registres: { key: string; arg: string }[] = [
  { key: 'Software\\Classes\\Drive\\shell\\Alpha', arg: '%1' },
  { key: 'Software\\Classes\\Directory\\shell\\Alpha', arg: '%1' },
  { key: 'Software\\Classes\\Directory\\Background\\shell\\Alpha', arg: '%V' },
];

function enableShellIntegration(): void {
  try {
    registres.forEach(({ key, arg }) => {
      let regKey = Registry.openKey(HKCU, key, Access.ALL_ACCESS);

      if (!regKey) {
        regKey = Registry.createKey(HKCU, key, Access.ALL_ACCESS);

        const cmdKey = Registry.createKey(HKCU, `${key}\\command`, Access.ALL_ACCESS);

        Registry.setValueSZ(regKey, 'Icon', exePath);
        Registry.setValueSZ(regKey, null, 'Open Alpha here');
        Registry.setValueSZ(cmdKey, null, `"${exePath}" "${arg}"`);
        Registry.closeKey(cmdKey);
      }

      Registry.closeKey(regKey);
    });
  } catch (error) {
    reportError(error);
  }
}

export function installCLI(): void {
  if (!firstRunFlag) return;

  try {
    const envKey = Registry.openKey(HKCU, 'Environment', Access.ALL_ACCESS);

    if (envKey) {
      const pathValue = Registry.queryValue(envKey, 'Path') as string | null;

      if (pathValue) {
        const isInstalled = pathValue.split(';').includes(binPath);

        if (!isInstalled) {
          const newPathValue = pathValue.concat(`;${binPath}`);

          Registry.setValueRaw(
            envKey,
            'Path',
            ValueType.EXPAND_SZ,
            Registry.formatString(newPathValue),
          );
        }
      }
    }

    Registry.closeKey(envKey);
  } catch (error) {
    reportError(error);
  }

  enableShellIntegration();
}
