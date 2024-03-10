import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authorizationReducer from './reducers/authorization.slice';
import previewFilesReducer from './reducers/previewFiles.slice';
import attachmentsReduser from './reducers/attachments.slice';

const rootReducer = combineReducers({
  auth: authorizationReducer,
  previewFiles: previewFilesReducer,
  attachments: attachmentsReduser,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, //-- Отключаем проверку на несериализуемые значения полностью --//
    }),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
