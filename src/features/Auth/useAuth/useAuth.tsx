'use client';
import jwtDecode from 'jwt-decode';
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';

import { updateRefreshToken } from '@/features/Auth/api/authApi';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { tokenIsRefreshingSelector } from '@/shared/store/selectors/auth';
import { tokenRefreshingStarted, tokenRefreshingStopped } from '@/shared/store/slices/auth';
import { logout as reduxLogout } from '@/shared/store/slices/user';
import {
  consoleLog,
  getRefreshToken,
  getStoredAccessToken,
  isTokenExpired,
  storeAccessToken,
  storeRefreshToken,
} from '@/shared/utils';
import { IObject } from '@daybrush/utils';

type AuthContextType = {
  logout: () => void;
  isLogged: boolean;
  setIsLogged: Dispatch<SetStateAction<boolean>>;
  executeQueryCallback: (callback: QueryCallback) => any;
  setAccessToken: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
type QueryCallback = (token: string) => any;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [deferredQueries, setDeferredQueries] = useState<QueryCallback[]>([]);
  const dispatch = useAppDispatch();
  const isRefreshingTokens = useAppSelector(tokenIsRefreshingSelector);
  const [isLoading, setIsLoading] = useState(true);

  const updateTokens = (refreshToken: string) => {
    consoleLog(`updating tokens:  isRefreshingTokens: ${isRefreshingTokens}`);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const tokenInfo = jwtDecode(refreshToken) as IObject<any>;
      let expires: Date | undefined = undefined;
      if (tokenInfo?.is_remember) {
        expires = new Date();
        expires.setMonth(expires.getMonth() + 1);
      }

      void updateRefreshToken(refreshToken)
        .then((response) => {
          const accessToken = response?.access_token;
          const refreshToken = response?.refresh_token;

          if (!accessToken || !refreshToken) {
            console.log('Logging out from updateTokens');

            logout();
            return;
          }

          consoleLog('updated tokens: ' + ' isRefreshingTokens: ' + isRefreshingTokens);
          consoleLog({ accessToken });
          storeAccessToken(accessToken);
          setAccessToken(accessToken);

          const options = expires ? { expires } : undefined;
          storeRefreshToken(refreshToken, options);
          consoleLog('access token update: ');
          consoleLog({ accessToken });
          setIsLogged(true);
        })
        .catch((error) => {
          console.error('updateRefreshToken failed1:');
          //logout if http error = 401, do not logout if network is lost, i.e. error.code === 'ERR_NETWORK'
          if (error.code === 'ERR_NETWORK' || error.response.status !== 401) return;

          console.error('Logging out from updateRefreshToken');
          logout();
          return;
        })
        .finally(() => {
          consoleLog(`isRefreshingTokens3: ${isRefreshingTokens}===false`);
          dispatch(tokenRefreshingStopped());
        });
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return;
    }
  };

  useEffect(() => {
    consoleLog('isRefreshingTokens31:' + isRefreshingTokens);

    if (!isRefreshingTokens) return;

    const refreshToken = getRefreshToken();

    if (!refreshToken || isTokenExpired(refreshToken)) {
      consoleLog('invalid refreshToken...');
      dispatch(tokenRefreshingStopped());

      console.log('Logging out from useEffect');
      logout();
      return;
    }
    updateTokens(refreshToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefreshingTokens]);

  useEffect(() => {
    if (deferredQueries.length === 0 || isRefreshingTokens) return;

    consoleLog('Executing callbacks after deferring...');
    consoleLog(accessToken);
    deferredQueries.map((qc) => qc(accessToken));
    setDeferredQueries([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const logout = () => {
    dispatch(reduxLogout());
    setIsLogged(false);
  };

  useEffect(() => {
    setIsLogged(true);
    const accessToken = getStoredAccessToken() || '';
    setAccessToken(accessToken);
    const token = getStoredAccessToken() || '';
    consoleLog('access token update:');
    consoleLog(token);

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      setIsLogged(false);
      setIsLoading(false);
      return;
    }

    if (isTokenExpired(refreshToken)) {
      setIsLogged(false);
      setIsLoading(false);
      return;
    }

    if (isTokenExpired(accessToken)) {
      dispatch(tokenRefreshingStarted());
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const executeQueryCallback = (callback: QueryCallback) => {
    consoleLog('entered executeQueryCallback...');
    if (!accessToken) {
      callback(accessToken);
      return;
    }

    if (isRefreshingTokens || !isLogged) {
      consoleLog('isRefreshingToken deferring execution of callback  ...');
      setDeferredQueries((prev) => [...prev, callback]);
      return;
    }
    if (isTokenExpired(accessToken)) {
      consoleLog('token is expired deferring execution of callback  ...');

      setDeferredQueries((prev) => [...prev, callback]);
      dispatch(tokenRefreshingStarted());
      return;
    }

    consoleLog('Executing callback without deferring...');

    return callback(accessToken);
  };

  const contextValue = {
    logout,
    isLogged,
    setIsLogged,
    executeQueryCallback,
    setAccessToken,
    isLoading,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
