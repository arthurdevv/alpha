import { join } from 'node:path';

import { _electron, test } from '@playwright/test';

const executablePath = join(__dirname, '../release/win-unpacked/Alpha.exe');

test('launches electron application', async () => {
  const app = await _electron.launch({ executablePath });
  const window = await app.firstWindow();

  await window.close();
});
