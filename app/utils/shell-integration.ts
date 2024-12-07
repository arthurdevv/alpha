import * as Registry from 'native-reg';
import { app } from 'electron';

const { HKCU, Access } = Registry;

const exePath = app.getPath('exe');

const keys = [
  'Software\\Classes\\Drive\\shell\\Alpha',
  'Software\\Classes\\Directory\\shell\\Alpha',
  'Software\\Classes\\Directory\\Background\\shell\\Alpha',
];

function enableShellIntegration(): void {
  try {
    keys.forEach(key => {
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
        Registry.setValueSZ(cmdKey, null, `${exePath} "%V"`);

        Registry.closeKey(cmdKey);
      }

      Registry.closeKey(regKey);
    });
  } catch (error) {
    console.error(error);
  }
}

export default enableShellIntegration;
