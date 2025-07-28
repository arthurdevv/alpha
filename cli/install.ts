import * as Registry from 'native-reg';
import { join } from 'path';
import { appPath } from 'app/settings/constants';
import enableShellIntegration from 'app/utils/shell-integration';

const binPath = join(appPath, '../../bin');

function installCLI(): void {
  const { HKCU, Access, ValueType } = Registry;

  const envKey = Registry.openKey(HKCU, 'Environment', Access.ALL_ACCESS)!;

  let value = Registry.queryValue(envKey, 'Path') as string;

  const isInstalled = value.split(';').includes(binPath);

  if (!isInstalled) {
    value = value.concat(`;${binPath}`);

    Registry.setValueRaw(
      envKey,
      'Path',
      ValueType.EXPAND_SZ,
      Registry.formatString(value),
    );
  }

  Registry.closeKey(envKey);

  enableShellIntegration();
}

export default installCLI;
