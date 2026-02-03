import * as Registry from 'native-reg';
import { binPath, firstRunFlag } from 'app/settings/constants';
import enableShellIntegration from 'app/utils/shell-integration';

function installCLI(): void {
  if (!firstRunFlag) return;

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
