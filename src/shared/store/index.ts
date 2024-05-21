import { IPrivateUser } from '@/entities/User';
import auth, { AuthStatus } from '@/shared/store/slices/auth';
import user from '@/shared/store/slices/user';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

export const reducer = combineReducers({
  user,
  auth,
});

export const createStore = () =>
  configureStore({
    reducer,
    devTools: process.env.NODE_ENV === 'development',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export type StoreState = { auth: AuthStatus; user: IPrivateUser };
