import * as Sentry from '@sentry/electron/renderer';

import { setErrorReporter, SENTRY_CONFIG } from 'shared/error-reporter';
import type { FlatSettings } from 'shared/types';

export function captureException(
  error: unknown,
  process = 'Renderer',
  hint?: any,
): void {
  if (Sentry.isInitialized()) Sentry.captureException(error, hint);

  console.error(`[${process} process]:`, error);
}

export default async ({ enableAnalytics }: FlatSettings): Promise<void> => {
  if (!(await ipc.app.isPackaged()) || !enableAnalytics) return;

  Sentry.init(SENTRY_CONFIG);

  setErrorReporter((process, error, context) => {
    captureException(error, process, {
      tags: { context },
      level: 'error',
    });
  });
};
