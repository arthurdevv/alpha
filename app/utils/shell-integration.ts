import * as Registry from 'native-reg';
import { app } from 'electron';
import { reportError } from 'shared/error-reporter';

const { HKCU, Access } = Registry;

const exePath = app.getPath('exe');

const items: Array<{ key: string; arg: string }> = [
  { key: 'Software\\Classes\\Drive\\shell\\Alpha', arg: '%1' },
  { key: 'Software\\Classes\\Directory\\shell\\Alpha', arg: '%1' },
  { key: 'Software\\Classes\\Directory\\Background\\shell\\Alpha', arg: '%V' },
];

function enableShellIntegration(): void {
  try {
    items.forEach(({ key, arg }) => {
      let regKey = Registry.openKey(HKCU, key, Access.ALL_ACCESS);

      if (!regKey) {
        regKey = Registry.createKey(HKCU, key, Access.ALL_ACCESS);

        const cmdKey = Registry.createKey(
          HKCU,
          `${key}\\command`,
          Access.ALL_ACCESS,
        );

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

export default enableShellIntegration;
