import { Dispatch, Middleware } from '@reduxjs/toolkit';
import { Terminal } from 'xterm';

const terms: Record<string, Terminal | null> = {};

const callbackMiddleware: Middleware<{}, AlphaState, Dispatch<AlphaActions>> =
  () => next => action => {
    const result = next(action);

    if (action.callback) {
      action.callback();

      delete action.callback;
    }

    return result;
  };

const writeMiddleware: Middleware<{}, AlphaState, Dispatch<AlphaActions>> =
  () => next => action => {
    if (action.type === 'PROCESS_SET_DATA') {
      const term = terms[action.id];

      if (term) {
        term.write(action.data);
      }
    }

    next(action);
  };

export { terms, callbackMiddleware, writeMiddleware };
