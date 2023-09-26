import { test, _electron as electron } from '@playwright/test';
import { join } from 'path';

const getExecutablePath = (): string => {
  switch (process.platform) {
    case 'win32':
      return join(__dirname, '../release/win-unpacked/Alpha.exe');

    case 'darwin':
      return join(__dirname, '../release/mac/Alpha.app/Contents/MacOS/Alpha');

    case 'linux':
      return join(__dirname, '../release/linux-unpacked/alpha');

    default:
      throw new Error(`${process.platform} is not supported.`);
  }
};

test('launches electron application', async () => {
  const executablePath = getExecutablePath();

  const app = await electron.launch({ executablePath });

  const window = await app.firstWindow();

  await window.close();
});
