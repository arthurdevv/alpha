import {
  configureStore,
  combineReducers,
  ConfigureStoreOptions,
} from '@reduxjs/toolkit';
import { callbackMiddleware, writeMiddleware } from './middlewares';
import windowReducer from './reducers/window';
import processReducer from './reducers/process';
import terminalReducer from './reducers/terminal';
import profilesReducer from './reducers/profiles';

const rootReducer: AlphaReducer = combineReducers({
  window: windowReducer,
  process: processReducer,
  terminal: terminalReducer,
  profiles: profilesReducer,
});

const config: ConfigureStoreOptions = {
  reducer: rootReducer,
  middleware: gDM =>
    gDM({
      serializableCheck: false,
    }).concat(callbackMiddleware, writeMiddleware),
};

const store: AlphaStore = configureStore(config);

export default store;
