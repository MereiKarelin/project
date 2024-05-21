'use client';
import Link from 'next/link';

import LetterUnread from '@/shared/assets/icons/LetterUnread';
import LockIcon from '@/shared/assets/icons/LockIcon';
import Logo from '@/shared/assets/icons/Logo';
import { useLogin } from '@/shared/hooks';
import Button from '@/shared/ui/Button';
import { CheckboxSwiper } from '@/shared/ui/CheckboxSwiper/CheckboxSwiper';
import { Input } from '@/shared/ui/Input';
import { IObject } from '@daybrush/utils';

import styles from './LoginFormModal.module.scss';

type PropTypes = {
  header: IObject<string>;
};

export const LoginFormModal = ({ header }: PropTypes) => {
  const {
    isLoginFormValid,
    isFetchingLoginResponse,
    loginFormErrors,
    setIsRememberLogin,
    onChangeLoginFormData,
    loginFormData,
    onSubmitLogin,
    wiggleLogin,
  } = useLogin();

  const onKeyPress = (e: any) => {
    if (e.code === 'Enter') {
      void onSubmitLogin(header);
    }
  };

  return (
    <div
      id="main"
      className="relative flex flex-col bg-[url('/assets/background.svg')] bg-no-repeat bg-cover text-[#011627] h-full"
    >
      <Link
        href={'/'}
        className="flex justify-center items-center gap-3 bg-white p-2 w-full sticky top-0 flex-row items drop-shadow"
      >
        <Logo fill="black" className="mb-1" />
      </Link>
      <div className="w-full flex flex-col items-center justify-start h-full">
        <div className="w-full sm:w-[528px] h-full flex flex-col justify-start bg-[#E7E7E7]/80 shadow-[0_4px_39px_0_#00564C26] text-[#011627] pt-6">
          <div className="w-full flex flex-col items-center justify-start gap-12 ">
            <div className="flex flex-col items-center gap-7 w-full">
              <span className="font-bold text-2xl">Рады Вас видеть!</span>
              <div className="flex flex-row gap-1 items-center">
                <span className="text-sm pt-[1px]">Первый раз?</span>
                <Link href={'/signup'}>
                  <span className="font-medium text-[#095F16] hover:text-[#2F9461] transition-all ease-in">
                    Срочно регистрируйтесь!
                  </span>
                </Link>
              </div>
            </div>
            {/*<Button*/}
            {/*  disabled*/}
            {/*  href={`${process.env.BACKEND_API_URL}/login/google`}*/}
            {/*  className="flex flex-row gap-3 rounded-full text-sm bg-white w-80 h-14 items-center justify-center font-bold"*/}
            {/*>*/}
            {/*  <GoogleIcon />*/}
            {/*  <span>Продолжить с Google</span>*/}
            {/*</Button>*/}
            <div className="flex flex-row gap-2 w-full justify-between items-center">
              <div className="w-52 h-1 bg-gradient-to-r from-[#70799100] to-[#707991]" />
              <span className="text-2xl font-bold text-[#707991]">ИЛИ</span>
              <div className="w-52 h-1 bg-gradient-to-l from-[#70799100] to-[#707991]" />
            </div>

            <div className="flex flex-col gap-12 w-80 items-center" onKeyDown={onKeyPress}>
              <div className="flex flex-col w-80">
                <label className="pl-10">Логин</label>
                <Input
                  id="login"
                  value={loginFormData.login}
                  onChange={onChangeLoginFormData}
                  name="login"
                  componentClassName={styles.inputNoMargin}
                  hasError={!!loginFormErrors.login && wiggleLogin}
                  placeholder="Нам нужен ваш логин"
                  variant="no-error-icon"
                >
                  <LetterUnread />
                </Input>

                {!loginFormErrors.login ? null : (
                  <div className="text-red-700">{loginFormErrors.login}</div>
                )}
              </div>

              <div className="flex flex-col gap-4 w-full items-center justify-center">
                <div className="flex flex-col w-80">
                  <label className="pl-10">Пароль</label>
                  <Input
                    id="password"
                    passwordHidden
                    value={loginFormData.password}
                    type="password"
                    name="password"
                    onChange={onChangeLoginFormData}
                    componentClassName={styles.inputNoMargin}
                    hasError={!!loginFormErrors.password && wiggleLogin}
                    placeholder="Без пароля никуда!"
                    variant="no-error-icon"
                  >
                    <LockIcon />
                  </Input>
                  {!loginFormErrors.login ? null : (
                    <div className="text-red-700">{loginFormErrors.password}</div>
                  )}
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex flex-row justify-end w-full">
                    <Link
                      href={'/reset-password'}
                      className="text-[#095F16] text-[13px] font-[800] active:text-[#2F9461]"
                    >
                      Забыли пароль?
                    </Link>
                  </div>
                  <div className="flex flex-row justify-start w-full gap-2 items-center">
                    <CheckboxSwiper
                      setIsRememberLogin={setIsRememberLogin}
                      background={'#011627'}
                    />
                    <div>Запомнить меня</div>
                  </div>
                </div>
                <div className="w-80">
                  <Button
                    onClick={() => onSubmitLogin(header)}
                    className="text-[#011627] h-14 relative overflow-hidden"
                    buttonRadius={'rounded-3xl'}
                    buttonColor={isLoginFormValid ? 'primary' : 'disabled'}
                  >
                    {!isFetchingLoginResponse ? null : (
                      <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-slate-300 to-slate-100 animate-[moveGradient_2s_infinite] opacity-50 blur-xl" />
                    )}
                    Продолжить
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginFormModal;
