'use client';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { getProfileAuth, getUserInfoAuth, loginUser } from '@/features/Auth/api/authApi';
import { useAuth } from '@/features/Auth/useAuth/useAuth';
import { useAppDispatch } from '@/shared/store/hooks';
import { login as loginAction } from '@/shared/store/slices/user';
import { storeAccessToken, storeProfileInfo, storeRefreshToken } from '@/shared/utils';
import { isEmailValid, isPhoneValid, isUsernameValid } from '@/shared/utils/login';
import { IObject } from '@daybrush/utils';

type LoginData = {
  login: string;
  password: string;
};

type LoginErrors = {
  login?: string;
  password?: string;
};

const emptyErrorsObject = {
  login: '',
  password: '',
};

type Token = {
  accessToken: string;
  refreshToken: string;
};

export const useLogin = () => {
  const [loginFormData, setLoginFormData] = useState<LoginData>({
    login: '',
    password: '',
  });
  const [loginFormErrors, setLoginFormErrors] = useState<LoginErrors>(emptyErrorsObject);
  const [isLoginFormValid, setIsLoginFormValid] = useState(true);
  const [isLoginValidationAllowed, setIsLoginValidationAllowed] = useState(false);
  const [wiggleLogin, setWiggleLogin] = useState(true);
  const [isFetchingLoginResponse, setIsFetchingLoginResponse] = useState(false);
  const [isPopupLoginFormOpen, setIsPopupLoginFormOpen] = useState(false);
  const [isRememberLogin, setIsRememberLogin] = useState(false);
  const { setIsLogged, setAccessToken } = useAuth();
  const dispatch = useAppDispatch();

  const validateLoginForm = useCallback((form: LoginData) => {
    const errors: LoginErrors = {};
    if (!form.login) {
      errors.login = 'Это поле не должно быть пустым';
    }
    if (!form.password) {
      errors.password = 'Это поле не должно быть пустым';
    }
    if (!isEmailValid(form.login) && !isPhoneValid(form.login) && !isUsernameValid(form.login)) {
      errors.login = 'Неправильно введен логин';
    }
    setLoginFormErrors(() => ({ ...errors }));
    if (errors) {
      return Object.entries(errors).length === 0;
    }
    return false;
  }, []);

  const setTokens = useCallback(
    (tokens: Token) => {
      if (!window) return;
      storeAccessToken(tokens.accessToken);
      setAccessToken(tokens.accessToken);

      // TODO ИСПРАВИТЬ ПРИСВОЕНИЕ КУКИ НА БЭКЕНДЕ
      if (isRememberLogin) {
        const expires = new Date();
        expires.setMonth(expires.getMonth() + 1);
        storeRefreshToken(tokens.refreshToken, { expires });
      } else {
        storeRefreshToken(tokens.refreshToken);
      }

      if (process.env.NODE_ENV == 'development') {
        if (isRememberLogin) {
          const expires = new Date();
          expires.setMonth(expires.getMonth() + 1);
          storeRefreshToken(tokens.refreshToken, { expires });
        } else {
          storeRefreshToken(tokens.refreshToken);
        }
      }
    },
    [isRememberLogin, setAccessToken],
  );

  const setAllUserInfo = useCallback(
    async (response: Token) => {
      try {
        const responseUserInfo = await getUserInfoAuth(response.accessToken);
        const userData = {
          ...responseUserInfo,
          birth_date: new Date(responseUserInfo.birth_date),
          created_at: new Date(responseUserInfo.created_at),
        };

        const payload = {
          user: userData,
        };
        dispatch(loginAction(payload));

        const responseProfileInfo = await getProfileAuth(
          responseUserInfo.reference,
          response.accessToken,
        );

        storeProfileInfo(responseProfileInfo);
        setTokens(response);
      } catch (error) {
        storeRefreshToken('');
        storeAccessToken('');
        setIsLogged(false);
        console.error(`User info update failed: ${error}`);
        throw error;
      }
    },
    [dispatch, setIsLogged, setTokens],
  );

  const onSubmitLogin = useCallback(
    async (header: IObject<string>) => {
      try {
        setWiggleLogin(false);
        setIsLoginValidationAllowed(true);
        const isValid = validateLoginForm(loginFormData);
        if (!isValid || isFetchingLoginResponse) {
          return;
        }
        setIsFetchingLoginResponse(true);

        const responseTokens = await loginUser(
          loginFormData.login,
          loginFormData.password,
          isRememberLogin,
          header,
        );
        await setAllUserInfo({
          accessToken: responseTokens.access_token,
          refreshToken: responseTokens.refresh_token,
        });

        setIsFetchingLoginResponse(false);
        setIsLogged(true);
      } catch (err: any) {
        setIsFetchingLoginResponse(false);
        const serverErrorCode = err.response?.data.exc_code;
        console.error(`Login failed: ${serverErrorCode}`);
        alert('Не удалось войти через данный логин и пароль');
        setIsLogged(false);
      }
    },
    [
      validateLoginForm,
      loginFormData,
      isFetchingLoginResponse,
      isRememberLogin,
      setAllUserInfo,
      setIsLogged,
    ],
  );

  const onChangeLoginFormData = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  useEffect(() => {
    //do not validate form until user presses continue button for the first time
    if (!isLoginValidationAllowed) return;
    const isValid = validateLoginForm(loginFormData);

    setIsLoginFormValid(isValid);
  }, [loginFormData, validateLoginForm, isLoginValidationAllowed]);

  useEffect(() => {
    if (wiggleLogin) return;

    const timerId = setTimeout(() => {
      setWiggleLogin(true);
    }, 100);

    return () => clearTimeout(timerId);
  }, [wiggleLogin]);

  return {
    loginFormData,
    onChangeLoginFormData,
    onSubmitLogin,
    loginFormErrors,
    isLoginFormValid,
    isFetchingLoginResponse,
    isPopupLoginFormOpen,
    setIsPopupLoginFormOpen,
    wiggleLogin,
    isRememberLogin,
    setIsRememberLogin,
    setAllUserInfo,
  };
};
