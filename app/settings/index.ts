import { Script, ScriptOptions } from 'vm';
import { readFileSync, writeFileSync } from 'fs';
import { shell } from 'electron';
import { exec } from 'child_process';
import hasDefaultEditor from 'app/utils/default-editor';
import { defaultPath, userPath } from './constants';

function createContext(code: { user: string; default: ISettings }): ISettings {
  const script = validateContext(code.user);

  const settings = script && getContext(script);

  if (settings) {
    return settings as ISettings;
  }

  return code.default || ({} as ISettings);
}

function getContext(script: Script): Record<string, any> {
  const module: Record<string, any> = {};

  script.runInNewContext({ module });

  return module.exports;
}

function validateContext(code: string): Script {
  const options: ScriptOptions = {
    filename: '.alpha.js',
    displayErrors: true,
  };

  try {
    return new Script(code, options);
  } catch (error) {
    throw error as { name: string };
  }
}

function extractContext(code: string) {
  const script = validateContext(code);

  const context = getContext(script);

  return context;
}

function createFile(path: string, data: string) {
  const format = data.replace(/\r\n/g, global.isWin ? '\r\n' : '\n');

  writeFileSync(path, format, 'utf-8');
}

function getSettings(): ISettings {
  const defaultCode = readFileSync(defaultPath, 'utf-8');

  const defaultContext = extractContext(defaultCode) as ISettings;

  let userScript: string;

  try {
    userScript = readFileSync(userPath, 'utf-8');
  } catch (error) {
    createFile(userPath, defaultCode);

    userScript = defaultCode;
  }

  const userContext = createContext({
    user: userScript,
    default: defaultContext,
  });

  return userContext;
}

function openSettings(): Promise<string> {
  if (global.isWin) {
    if (hasDefaultEditor) {
      return shell.openPath(userPath);
    }

    return new Promise<string>(() => {
      exec(`notepad.exe ${userPath}`);
    });
  }

  return shell.openPath(userPath);
}

export { getSettings, openSettings };
