import * as Sentry from '@sentry/electron/renderer';
import { errorLog } from 'app/common/logger';
import { isPackaged, SENTRY_CONFIG } from 'app/settings/constants';
import { setErrorReporter } from 'shared/error-reporter';

export function captureException(
  error: unknown,
  process = 'Renderer',
  hint?: any,
): void {
  if (Sentry.isInitialized()) Sentry.captureException(error, hint);

  console.error(errorLog(`[${process} process]:`), error);
}

export default ({ enableAnalytics }: ISettings): void => {
  if (!isPackaged || !enableAnalytics) return;

  Sentry.init(SENTRY_CONFIG);

  setErrorReporter((process, error, context) => {
    captureException(error, process, {
      tags: { context },
      level: 'error',
    });
  });
};
