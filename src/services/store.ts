import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authorizationReducer from './reducers/authorization.slice';
import previewFilesReducer from './reducers/previewFiles.slice';

const rootReducer = combineReducers({
  auth: authorizationReducer,
  previewFiles: previewFilesReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
