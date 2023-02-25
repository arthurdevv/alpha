import * as Registry from 'native-reg';

const getEditorChoice = (): string | undefined => {
  const subKey =
    'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\FileExts\\.js';

  const extsKeys = Registry.openKey(
    Registry.HKCU,
    subKey,
    Registry.Access.READ,
  );

  const keyNames = extsKeys ? Registry.enumKeyNames(extsKeys) : [];

  Registry.closeKey(extsKeys);

  const userChoice = keyNames.find(key => key.endsWith('UserChoice'));

  return userChoice ? `${subKey}\\${userChoice}` : userChoice;
};

const hasDefaultEditor = () => {
  const editorChoice = getEditorChoice();

  if (editorChoice) {
    const choiceKey = Registry.openKey(
      Registry.HKCU,
      editorChoice,
      Registry.Access.READ,
    )!;

    const valueNames = Registry.enumValueNames(choiceKey).map(value =>
      Registry.queryValue(choiceKey, value),
    );

    Registry.closeKey(choiceKey);

    return valueNames.every(
      value =>
        value &&
        typeof value === 'string' &&
        !value.includes('WScript.exe') &&
        !value.includes('JSFile'),
    );
  }

  return false;
};

export default hasDefaultEditor();
