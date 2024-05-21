'use client';
import classNames from 'classnames';
import Link from 'next/link';

import LoaderSpinnerAnimatedIcon from '@/shared/assets/icons/LoaderSpinnerAnimatedIcon';
import Logo from '@/shared/assets/icons/Logo';
import { useSignUp } from '@/shared/hooks';
import Button from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import {
  stepOneDays as days,
  stepOneMonths as months,
  stepOneYears as years,
} from '@/shared/utils/date';
import { IObject } from '@daybrush/utils';

type PropTypes = {
  referralReference?: string;
  header: IObject<string>;
};

export const SignupUser = ({ referralReference, header }: PropTypes) => {
  const {
    // SIGNUP BLOCK START
    backendSignupErrors,
    signupFormErrors,
    wiggleSignup,
    signupFormData,
    signupInputIsLoading,
    handleInputSignupChange,
    signupCustomPass,
    onChangeSignupFormData,
    setSignupCustomPass,
    signupRepeatPassword,
    setSignupRepeatPassword,
    isFetchingSignupResponse,
    isSignupFormValid,
    onSubmitSignup,
    onKeyDown,
    // SIGNUP BLOCK END
  } = useSignUp(header);

  return (
    <div className="justify-center items-center grid h-screen p-2">
      <div className="grid gap-3 min-[550px]:w-[514px]">
        <Link href={'/'} className="grid justify-center items-center">
          <Logo fill={'black'} />
        </Link>
        <div className="text-center text-xl font-bold">
          Начните творить сразу после регистрации!
        </div>
        <Link
          href={'/login'}
          className="text-[#2F9461] underline decoration-1 font-[700] text-center"
        >
          Уже есть аккаунт
        </Link>
        <div onKeyDown={onKeyDown}>
          <div className="grid gap-3">
            <div className="flex flex-col">
              <label className="pl-2">Уникальный никнейм</label>
              <Input
                value={signupFormData.username}
                name="username"
                onChange={(e) => handleInputSignupChange(e, 'username')}
                placeholder="Нам нужен Ваш логин"
                loading={signupInputIsLoading.username}
                hasError={
                  (!!backendSignupErrors.username || !!signupFormErrors.username) && wiggleSignup
                }
                componentClassName={'outline-none border-gray-500 border-b-2 rounded p-2'}
              />
              {!signupFormErrors.username ? null : (
                <div className="text-red-700">
                  {backendSignupErrors.username || signupFormErrors.username}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <label className="pl-2">Почта</label>
              <Input
                value={signupFormData.email}
                name="email"
                onChange={(e) => handleInputSignupChange(e, 'email')}
                placeholder="Нам нужна Ваша почта"
                loading={signupInputIsLoading.email}
                hasError={(!!backendSignupErrors.email || !!signupFormErrors.email) && wiggleSignup}
                componentClassName={'outline-none border-gray-500 border-b-2 rounded p-2'}
              />
              {!signupFormErrors.email ? null : (
                <div className="text-red-700">
                  {backendSignupErrors.email || signupFormErrors.email}
                </div>
              )}
            </div>
            <div className="text-[#111] text-[16px]">Ваша дата рождения?</div>
            <div className="flex items-center gap-5">
              <Select
                options={days}
                value={signupFormData.day}
                handleChange={onChangeSignupFormData}
                name="day"
                placeholder="День"
                hasError={(!!backendSignupErrors.day || !!signupFormErrors.day) && wiggleSignup}
                className={'w-full'}
              />
              <Select
                options={months}
                value={signupFormData.month}
                handleChange={onChangeSignupFormData}
                name="month"
                placeholder="Месяц"
                hasError={(!!backendSignupErrors.month || !!signupFormErrors.month) && wiggleSignup}
                className={'w-full'}
              />
              <Select
                options={years}
                value={signupFormData.year}
                handleChange={onChangeSignupFormData}
                name="year"
                placeholder="Год"
                hasError={(!!backendSignupErrors.year || !!signupFormErrors.year) && wiggleSignup}
                className={'w-full'}
              />
            </div>
            {!signupFormErrors.day ? null : (
              <div className="text-red-700">{backendSignupErrors.day || signupFormErrors.day}</div>
            )}
            <div className="flex flex-col">
              <label className="pl-2">Пароль</label>
              <Input
                value={signupCustomPass}
                name="password"
                onChange={(e) => {
                  onChangeSignupFormData(e);
                  setSignupCustomPass(e.target.value);
                }}
                hasError={
                  (!!backendSignupErrors.password || !!signupFormErrors.password) && wiggleSignup
                }
                placeholder="Куда же без пароля?"
                componentClassName={'outline-none border-gray-500 border-b-2 rounded p-2'}
                type="password"
                passwordHidden
              />
              {!signupFormErrors.password ? null : (
                <div className="text-red-700">
                  {backendSignupErrors.password || signupFormErrors.password}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <label className="pl-2">Повторите пароль</label>
              <Input
                value={signupRepeatPassword}
                onChange={(e) => setSignupRepeatPassword(e.target.value)}
                placeholder="Введите еще раз"
                hasError={
                  (!!backendSignupErrors.password || !!signupFormErrors.password) && wiggleSignup
                }
                componentClassName={'outline-none border-gray-500 border-b-2 rounded p-2'}
                type="password"
                passwordHidden
              />
              {!signupFormErrors.password ? null : (
                <div className="text-red-700">
                  {backendSignupErrors.password || signupFormErrors.password}
                </div>
              )}
            </div>
            <Button
              buttonSize="l"
              onClick={() => onSubmitSignup(header, referralReference)}
              className={classNames(
                'text-white relative overflow-hidden bg-[#2DC96B]',
                !isFetchingSignupResponse && '!p-6',
              )}
              buttonRadius={'rounded-full'}
              buttonColor={isSignupFormValid ? 'primary' : 'disabled'}
            >
              {!isFetchingSignupResponse ? (
                <div>Создать аккаунт</div>
              ) : (
                <div role="status">
                  <LoaderSpinnerAnimatedIcon className="dark:text-green-400 fill-green-500 w-6 h-6 text-green-400" />
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </Button>
            <div className="flex flex-col items-center text-[13px] pb-3">
              <div className="flex flex-row">
                Нажимая <span className="text-[#2F9461] font-[700]">“Создать аккаунт”</span> - вы
                соглашаетесь с нашей
              </div>
              <div className="flex flex-row">
                <Link href={'/policy'} className="text-[#2F9461] underline decoration-1 font-[700]">
                  Политикой Конфиденциальности
                </Link>
                &nbsp;и&nbsp;
                <Link href={'/terms'} className="text-[#2F9461] underline decoration-1 font-[700]">
                  Пользовательским соглашением
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
