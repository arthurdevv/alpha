let reporter: ErrorReporter = () => {};

export function setErrorReporter(fn: ErrorReporter) {
  reporter = fn;
}

export function reportError(error: unknown, context?: string) {
  reporter(process.type === 'browser' ? 'Main' : 'Renderer', error, context);
}
