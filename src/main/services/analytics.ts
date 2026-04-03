import * as Sentry from '@sentry/electron/main';

import { setErrorReporter, SENTRY_CONFIG } from 'shared/error-reporter';

export function captureException(
  error: unknown,
  process = 'Main',
  hint?: any,
): void {
  if (Sentry.isInitialized()) Sentry.captureException(error, hint);

  console.error(`[${process} process]:`, error);
}

export default (enabled: boolean): void => {
  if (!enabled) return;

  Sentry.init(SENTRY_CONFIG);

  setErrorReporter((process, error, context) => {
    captureException(error, process, {
      tags: { context },
      level: 'error',
    });
  });
};
