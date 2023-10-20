import * as Registry from 'native-reg';
import { join } from 'path';
import { appPath } from 'app/settings/constants';
import enableShellIntegration from 'app/utils/shell-integration';

enableShellIntegration();

const { HKCU, Access, ValueType } = Registry;

let binPath = join(appPath, '../../bin');

function installCLI() {
  const envKey = Registry.openKey(HKCU, 'Environment', Access.ALL_ACCESS)!;

  const value = Registry.queryValue(envKey, 'Path') as string;

  binPath = value.concat(`;${binPath}`);

  Registry.setValueRaw(
    envKey,
    'Path',
    ValueType.EXPAND_SZ,
    Registry.formatString(binPath),
  );

  Registry.closeKey(envKey);
}

export default installCLI;
