import type { AnalyticsConfig, ErrorReporter } from 'shared/types';

export const SENTRY_CONFIG: AnalyticsConfig = {
  dsn: 'https://c737a602ad574456ba2313b229e1e80b@app.glitchtip.com/19339',
  tracesSampleRate: 0,
};

let reporter: ErrorReporter = () => {};

export function setErrorReporter(fn: ErrorReporter) {
  reporter = fn;
}

export function reportError(error: unknown, context?: string) {
  reporter(typeof window === 'undefined' ? 'Main' : 'Renderer', error, context);
  console.error(error);
}
