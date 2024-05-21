'use client';
import React, { useCallback, useEffect, useState } from 'react';

import { registrationData } from '@/entities/Auth/types/types';
import {
  checkEmailAvailability,
  checkUsernameAvailability,
  loginUser,
  signupUser,
} from '@/features/Auth/api/authApi';
import { useLogin } from '@/shared/hooks';
import { useDebounce } from '@/shared/hooks/';
import { isValidDate } from '@/shared/utils/date';
import { isEmailValid, isUsernameValid } from '@/shared/utils/login';
import { IObject } from '@daybrush/utils';

type SignupFormErrors = {
  username?: string;
  email?: string;
  password?: string;
  day?: string;
  month?: string;
  year?: string;
};

const emptyErrorsObject = {
  username: '',
  email: '',
  password: '',
  day: '',
  month: '',
  year: '',
};

export const useSignUp = (header: IObject<string>) => {
  const [signupFormErrors, setSignupFormErrors] = useState<SignupFormErrors>(emptyErrorsObject);
  const [backendSignupErrors, setBackendSignupErrors] =
    useState<SignupFormErrors>(emptyErrorsObject);
  const [signupInputIsLoading, setSignupInputIsLoading] = useState<{
    username: boolean;
    email: boolean;
  }>({
    username: false,
    email: false,
  });
  const [signupRepeatPassword, setSignupRepeatPassword] = useState('');
  const [isSignupFormValid, setIsSignupFormValid] = useState(true);
  const [signupCustomPass, setSignupCustomPass] = useState('');
  const [wiggleSignup, setWiggleSignup] = useState(true);
  const [isFetchingSignupResponse, setIsFetchingSignupResponse] = useState(false);
  const [isSignupValidationAllowed, setIsSignupValidationAllowed] = useState(false);
  const [isPopupSignupFormOpen, setIsPopupSignupFormOpen] = useState(false);
  const [signupFormData, setSignupFormData] = useState<registrationData>({
    username: '',
    password: '',
    phone: '',
    day: '',
    month: '',
    year: '',
    fullname: '',
    email: '',
    code: '',
  });
  const { isRememberLogin, setAllUserInfo } = useLogin();

  const validateSignupForm = useCallback(() => {
    let hasErrors = false; // Изначально предполагаем, что ошибок нет
    const errors: SignupFormErrors = {};

    // Валидация email
    if (!signupFormData.email) {
      errors.email = 'Это поле не должно быть пустым';
      hasErrors = true;
    } else if (!isEmailValid(signupFormData.email)) {
      errors.email = 'Неправильно введена почта';
      hasErrors = true;
    }

    // Валидация username
    if (!signupFormData.username) {
      errors.username = 'Это поле не должно быть пустым';
      hasErrors = true;
    } else if (!isUsernameValid(signupFormData.username)) {
      errors.username =
        'Логин может содержать только цифры, буквы латинского алфавита и знак подчеркивания';
      hasErrors = true;
    }

    // Валидация пароля
    if (!signupFormData.password) {
      errors.password = 'Это поле не должно быть пустым';
      hasErrors = true;
    } else if (signupFormData.password !== signupRepeatPassword) {
      errors.password = 'Пароли не совпадают';
      hasErrors = true;
    } else if (signupFormData.password.length < 8) {
      errors.password = 'Пароль должен быть больше 8 символов';
      hasErrors = true;
    }

    // Валидация даты рождения
    if (!signupFormData.day || !signupFormData.month || !signupFormData.year) {
      errors.day = errors.month = errors.year = 'Все поля даты должны быть заполнены';
      hasErrors = true;
    } else if (
      !isValidDate(
        parseInt(signupFormData.day),
        parseInt(signupFormData.month),
        parseInt(signupFormData.year),
      )
    ) {
      errors.day = 'Неправильная дата';
      hasErrors = true;
    }

    // Обновление состояния ошибок формы
    setSignupFormErrors(errors);

    // Возврат значения валидности формы (true если ошибок нет, иначе false)
    return !hasErrors;
  }, [signupFormData, signupRepeatPassword]);

  useEffect(() => {
    //do not validate form until user presses continue button for the first time
    if (!isSignupValidationAllowed) return;
    const isValid = validateSignupForm();
    setIsSignupFormValid(isValid);
  }, [signupFormData, validateSignupForm, isSignupValidationAllowed]);

  const onChangeSignupFormData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>) => {
      e.preventDefault();
      setSignupFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    [],
  );

  const debouncedLogin = useDebounce(async (val: string, type: 'username' | 'email') => {
    // Очистка предыдущих ошибок и установка состояния загрузки
    setBackendSignupErrors((prev) => ({ ...prev, [type]: '' }));
    setSignupInputIsLoading((state) => ({ ...state, [type]: true }));

    try {
      // Выбор функции API в зависимости от типа проверки
      const checkAvailability =
        type === 'username' ? checkUsernameAvailability : checkEmailAvailability;
      const result = await checkAvailability(val);
      // Если результат null, поле свободно
      if (result === null) {
        setBackendSignupErrors((prev) => ({ ...prev, [type]: '' }));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.exc_code;
      if (errorMessage === 'UserWithThisEmailAlreadyExistError' && type === 'email') {
        setBackendSignupErrors((prev) => ({
          ...prev,
          [type]: 'Пользователь с таким email уже существует',
        }));
      } else if (errorMessage === 'UserWithThisUsernameAlreadyExistError' && type === 'username') {
        setBackendSignupErrors((prev) => ({
          ...prev,
          [type]: 'Пользователь с таким никнеймом уже существует',
        }));
      } else {
        // Обработка неизвестной ошибки
        console.error('Unknown error during signup validation:', error);
      }
    } finally {
      // Снятие индикатора загрузки вне зависимости от результата
      setSignupInputIsLoading((state) => ({ ...state, [type]: false }));
    }
  }, 800);

  const handleInputSignupChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    onChangeSignupFormData(e);
    debouncedLogin(e.target.value, id);
  };

  const onKeyDown = async (e: any) => {
    if (e.code === 'Enter') {
      await onSubmitSignup(header);
    }
  };

  useEffect(() => {
    if (wiggleSignup) return;
    const timerId = setTimeout(() => {
      setWiggleSignup(true);
    }, 100);
    return () => clearTimeout(timerId);
  }, [wiggleSignup]);

  const onSubmitSignup = async (header: IObject<string>, referralReference?: string) => {
    setIsSignupValidationAllowed(true);
    const isValid = validateSignupForm();
    setWiggleSignup(false);
    // check isFetchingResponse to not send second request if the first is still being fetched
    if (!isValid || isFetchingSignupResponse) return;
    try {
      setIsFetchingSignupResponse(true);
      await signupUser(
        signupFormData.username,
        signupFormData.password,
        `${signupFormData.year}-${signupFormData.month}-${signupFormData.day}`,
        signupFormData.email,
        referralReference,
      );
      const responseTokens = await loginUser(
        signupFormData.username,
        signupFormData.password,
        isRememberLogin,
        header,
      );
      await setAllUserInfo({
        accessToken: responseTokens.access_token,
        refreshToken: responseTokens.refresh_token,
      });
      setIsFetchingSignupResponse(false);
    } catch (err: any) {
      setIsFetchingSignupResponse(false);
    }
  };

  return {
    signupFormErrors,
    backendSignupErrors,
    signupInputIsLoading,
    signupRepeatPassword,
    signupCustomPass,
    wiggleSignup,
    isFetchingSignupResponse,
    signupFormData,
    onChangeSignupFormData,
    handleInputSignupChange,
    onKeyDown,
    onSubmitSignup,
    setSignupCustomPass,
    setSignupRepeatPassword,
    isSignupFormValid,
    isPopupSignupFormOpen,
    setIsPopupSignupFormOpen,
  };
};
