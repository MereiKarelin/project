'use client';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { GetNotifications, MainMenuPanel, SearchUser, useAuth, useNotification } from '@/features';
import { ChatIcon } from '@/shared/assets/icons';
import BellIcon from '@/shared/assets/icons/BellIcon';
import BurgerIcon from '@/shared/assets/icons/BurgerIcon';
import CustomizeIcon from '@/shared/assets/icons/CustomizeIcon';
import FeedIcon from '@/shared/assets/icons/FeedIcon';
import LoaderSpinnerAnimatedIcon from '@/shared/assets/icons/LoaderSpinnerAnimatedIcon';
import Logo from '@/shared/assets/icons/Logo';
import ProfileIcon from '@/shared/assets/icons/ProfileIcon';
import RelationsIcon from '@/shared/assets/icons/RelationsIcon';
import SettingsIcon from '@/shared/assets/icons/SettingsIcon';
import { useLogin, useSignUp } from '@/shared/hooks';
import { useAppSelector } from '@/shared/store/hooks';
import { userSelector } from '@/shared/store/selectors/user';
import Button from '@/shared/ui/Button';
import { CheckboxSwiper } from '@/shared/ui/CheckboxSwiper/CheckboxSwiper';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { lockBackground } from '@/shared/utils';
import {
  stepOneDays as days,
  stepOneMonths as months,
  stepOneYears as years,
} from '@/shared/utils/date';
import { IObject } from '@daybrush/utils';

type PropTypes = {
  onClickToCustomization?: () => void;
  isNoBackgroundColor?: boolean;
  isDarkTheme?: boolean;
  isVisible?: boolean;
  className?: string;
  header: IObject<string>;
};

const MainHeader = ({
  onClickToCustomization,
  isVisible = true,
  isNoBackgroundColor = false,
  isDarkTheme = false,
  className,
  header,
}: PropTypes) => {
  const router = useRouter();
  const [isBurgerOpen, setIsBurgerOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const { totalUnreadNotifications, totalUnreadNewMessages } = useNotification();

  const {
    backendSignupErrors,
    signupFormErrors,
    wiggleSignup,
    signupFormData,
    isPopupSignupFormOpen,
    setIsPopupSignupFormOpen,
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
  } = useSignUp(header);

  const {
    isLoginFormValid,
    isFetchingLoginResponse,
    loginFormErrors,
    onChangeLoginFormData,
    loginFormData,
    setIsRememberLogin,
    onSubmitLogin,
    isPopupLoginFormOpen,
    setIsPopupLoginFormOpen,
  } = useLogin();

  const { isLogged } = useAuth();

  const userInfo = useAppSelector(userSelector);

  const openBurger = () => {
    setIsBurgerOpen(true);
    setIsNotificationsOpen(false);
    lockBackground(true);
  };

  const closeBurger = () => {
    setIsBurgerOpen(false);
    lockBackground(false);
  };

  const openNotifications = () => {
    setIsNotificationsOpen(true);
    setIsBurgerOpen(false);
    lockBackground(true);
  };

  const closeNotifications = () => {
    setIsNotificationsOpen(false);
    lockBackground(false);
  };

  const openPopupLoginForm = () => {
    setIsPopupLoginFormOpen(true);
    lockBackground(true);
  };

  const closePopupLoginForm = () => {
    setIsPopupLoginFormOpen(false);
    if (isBurgerOpen) {
      lockBackground(true);
    } else {
      lockBackground(false);
    }
  };

  const openPopupRegisterForm = () => {
    setIsPopupSignupFormOpen(true);
    lockBackground(true);
  };

  const closePopupRegisterForm = () => {
    setIsPopupSignupFormOpen(false);
    if (isBurgerOpen) {
      lockBackground(true);
    } else {
      lockBackground(false);
    }
  };

  useEffect(() => {
    if (!isLogged) return;
    closePopupLoginForm();
    closePopupRegisterForm();
    closeNotifications();
  }, [isLogged]);

  useEffect(() => {
    if (isLogged) return;
    closeNotifications();
  }, [isLogged]);

  useEffect(() => {
    if (isPopupLoginFormOpen) {
      openPopupLoginForm();
    }
    if (isPopupSignupFormOpen) {
      openPopupRegisterForm();
    }
  }, [isPopupLoginFormOpen, isPopupSignupFormOpen]);

  if (!isVisible) return null;

  const handleLinkClick = (e: any, link: string) => {
    e.preventDefault();
    if (!isLogged) {
      openPopupLoginForm();
    } else {
      lockBackground(false);
      router.push(link, { scroll: false });
    }
  };

  const desktopHeader = (
    <div
      className={classNames(
        className,
        !isNoBackgroundColor && 'bg-[#F5F5F5] drop-shadow-md',
        'z-40 grid grid-cols-[1fr_514px_1fr] sticky top-0 text-amber-50 gap-3 h-[60px] justify-center max-[960px]:hidden',
      )}
    >
      <div className="ml-2 drop-shadow w-[320px] justify-self-end self-center max-[1200px]:w-[200px]">
        <Link href={'/'} className="grid justify-center items-center">
          <Logo fill={'black'} />
        </Link>
      </div>
      <ul className="flex gap-2 items-center bg-white pl-10 pr-10 h-full rounded-full justify-center w-[514px] justify-self-center">
        <div className="flex h-full items-center justify-center">
          <Link
            onClick={(e) => handleLinkClick(e, '/id')}
            className="cursor-pointer flex items-center hover:bg-gradient-to-t hover:from-[#D8FFD8] transition delay-150 duration-300 ease-in-out p-4 h-full"
            href={'/id'}
          >
            <ProfileIcon className="w-[22px] h-[22px]" fill="#011627" strokeWidth="1.0" />
          </Link>
          <Link
            onClick={(e) => handleLinkClick(e, '/direct')}
            className="cursor-pointer flex items-center hover:bg-gradient-to-t hover:from-[#D8FFD8] transition delay-150 duration-300 ease-in-out p-4 h-full"
            href={'/direct'}
          >
            <div className="relative">
              <ChatIcon className="w-[22px] h-[22px]" fill="#011627" strokeWidth="1.0" />
              {totalUnreadNewMessages === 0 ? null : (
                <div className="absolute bg-red-500 pr-2 pl-2 rounded-full">
                  {totalUnreadNewMessages}
                </div>
              )}
            </div>
          </Link>
          <Link
            onClick={(e) => handleLinkClick(e, '/feed')}
            className="cursor-pointer flex items-center hover:bg-gradient-to-t hover:from-[#D8FFD8] transition delay-150 duration-300 ease-in-out p-4 h-full"
            href={'/feed'}
          >
            <FeedIcon className="w-[22px] h-[22px]" fill="#011627" strokeWidth="1.0" />
          </Link>
        </div>
        <Link
          className="flex bg-[#011627] w-[58px] h-[58px] justify-center items-center rounded-full "
          onClick={() => {
            if (!isLogged) {
              openPopupLoginForm();
            } else {
              onClickToCustomization
                ? onClickToCustomization()
                : router.push('/customization', { scroll: false });
            }
          }}
          href={'/customization'}
        >
          <CustomizeIcon className="w-[22px] h-[22px]" fill="#78E378" />
        </Link>
        <div className="flex h-full justify-center items-center ">
          <div
            className="cursor-pointer flex items-center hover:bg-gradient-to-t hover:from-[#D8FFD8] transition delay-150 duration-300 ease-in-out p-4 h-full"
            onClick={() => {
              if (!isLogged) {
                openPopupLoginForm();
              } else {
                setIsNotificationsOpen((prev) => !prev);
              }
            }}
          >
            <div className="relative">
              <BellIcon className="w-[22px] h-[22px]" fill="#011627" />
              {totalUnreadNotifications === 0 ? null : (
                <div className="absolute bg-red-500 pr-2 pl-2 rounded-full">
                  {totalUnreadNotifications}
                </div>
              )}
            </div>
            <div
              className={classNames(
                isNotificationsOpen ? 'block' : 'hidden',
                'absolute text-black top-[100%] right-[0%] w-full grid justify-center items-center mt-2',
              )}
            >
              <span className="font-bold bg-white p-4 rounded-t">Уведомления</span>
              <div className="bg-white w-[398px] h-[50vh] overflow-scroll p-2 rounded-b">
                <GetNotifications
                  isNotificationsOpen={isNotificationsOpen}
                  setIsNotificationsOpen={setIsNotificationsOpen}
                />
              </div>
            </div>
          </div>
          <Link
            onClick={(e) =>
              handleLinkClick(e, userInfo?.reference ? `/id/${userInfo?.username}/relations` : '/')
            }
            className="cursor-pointer flex items-center hover:bg-gradient-to-t hover:from-[#D8FFD8] transition delay-150 duration-300 ease-in-out p-4 h-full"
            href={userInfo?.reference ? `/id/${userInfo?.username}/relations` : '/'}
          >
            <RelationsIcon className="w-[22px] h-[22px]" fill="#011627" strokeWidth="1.0" />
          </Link>
          <Link
            onClick={(e) => handleLinkClick(e, '/settings')}
            className="cursor-pointer flex items-center hover:bg-gradient-to-t hover:from-[#D8FFD8] transition delay-150 duration-300 ease-in-out p-4 h-full"
            href={'/settings'}
          >
            <SettingsIcon className="w-[22px] h-[22px]" fill="#011627" />
          </Link>
        </div>
      </ul>
      <div className="justify-self-start self-center">
        {isLogged ? (
          <SearchUser
            componentClassName="gap-0 bg-[#011627] p-2 pr-4 gap-3"
            iconClassName="text-green w-[20px] h-[20px]"
            inputClassName="bg-transparent text-[#78E378]"
            resultClassName="text-white cursor-pointer hover:bg-[#FFFFFF1a] rounded-[20px] transition delay-0 duration-200 ease-in-out p-1"
            searchContainerClassName="bg-[#011627] text-white rounded-bl-[20px] rounded-br-[20px] p-2 gap-2"
          />
        ) : (
          <div
            className="pr-6 pl-6 cursor-pointer text-white bg-[#2DC96B] font-bold text-start items-center justify-center flex gap-3 p-2 rounded-[25px]"
            onClick={() => openPopupLoginForm()}
          >
            Войти в аккаунт
          </div>
        )}
      </div>
    </div>
  );

  const mobileHeader = (
    <div
      className={classNames(
        className,
        'grid min-[960px]:hidden drop-shadow sticky top-0 w-full z-40',
      )}
    >
      <div
        className={classNames(
          isBurgerOpen ? 'hidden' : 'flex',
          !isNoBackgroundColor && 'bg-white',
          'min-[960px]:hidden h-[60px] sticky top-0 items-center justify-between pl-2 pr-2 z-40',
        )}
      >
        <button
          onClick={() => {
            if (!isBurgerOpen) {
              openBurger();
            } else {
              closeBurger();
            }
          }}
        >
          <BurgerIcon className="w-[30px] h-[30px]" fill={isDarkTheme ? 'white' : 'black'} />
        </button>
        <Link href={'/'}>
          <Logo fill={isDarkTheme ? 'white' : 'black'} />
        </Link>
        <div
          className="flex gap-3 text-white text-start"
          onClick={() => {
            if (!isLogged) {
              openPopupLoginForm();
            } else {
              if (!isNotificationsOpen) {
                openNotifications();
              } else {
                closeNotifications();
              }
            }
          }}
        >
          <div className="relative cursor-pointer">
            <BellIcon className="w-[30px] h-[30px]" fill={isDarkTheme ? 'white' : '#212330'} />
            {totalUnreadNotifications === 0 ? null : (
              <div className="absolute right-0 bg-red-500 pr-2 pl-2 rounded-full">
                {totalUnreadNotifications}
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={classNames(
          isNotificationsOpen ? 'grid' : 'hidden',
          'bg-[#212330] gap-3 grid-rows-[60px_1fr] top-0 absolute w-full z-40 h-screen pl-2 pr-2 min-[960px]:hidden',
        )}
      >
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              if (!isBurgerOpen) {
                openBurger();
              } else {
                closeBurger();
              }
            }}
          >
            <BurgerIcon className="w-[30px] h-[30px]" fill="white" />
          </button>
          <Logo fill={'white'} />
          <div
            className="flex gap-3 text-white text-start cursor-pointer relative"
            onClick={() => {
              if (!isLogged) {
                openPopupLoginForm();
              } else {
                if (!isNotificationsOpen) {
                  openNotifications();
                } else {
                  closeNotifications();
                }
              }
            }}
          >
            <BellIcon className="w-[30px] h-[30px]" fill="white" />
            {totalUnreadNotifications === 0 ? null : (
              <div className="absolute top-[50%] right-0 bg-red-500 pr-2 pl-2 rounded-full">
                {totalUnreadNotifications}
              </div>
            )}
          </div>
        </div>
        <div>
          <span className="text-white">Уведомления</span>
          <div className="bg-white overflow-scroll p-2 rounded-b">
            <GetNotifications
              isNotificationsOpen={isNotificationsOpen}
              setIsNotificationsOpen={setIsNotificationsOpen}
            />
          </div>
        </div>
      </div>
      <div
        className={classNames(
          isBurgerOpen ? 'grid' : 'hidden',
          'bg-[#212330] gap-3 grid-rows-[60px_55px_1fr] top-0 absolute w-full z-40 h-screen pl-2 pr-2 min-[960px]:hidden',
        )}
      >
        <MainMenuPanel
          openBurger={openBurger}
          closeBurger={closeBurger}
          openPopupLoginForm={openPopupLoginForm}
          openNotifications={openNotifications}
          closeNotifications={closeNotifications}
          isBurgerOpen={isBurgerOpen}
          isLogged={isLogged}
          isNotificationsOpen={isNotificationsOpen}
          totalUnreadNotifications={totalUnreadNotifications}
        />
        <SearchUser
          componentClassName="gap-0 bg-white pl-4 pr-4 gap-3"
          iconClassName="text-green w-[30px] h-[30px]"
          inputClassName="bg-transparent text-black"
          resultClassName="cursor-pointer hover:bg-[#D9D9D9] transition delay-0 duration-200 ease-in-out p-4"
          searchContainerClassName="bg-white text-black rounded-bl-[20px] rounded-br-[20px]"
        />
        <ul className="grid text-white grid-rows-[60px_60px_60px_60px_60px_60px_60px] items-center font-bold gap-1">
          <Link
            onClick={(e) => handleLinkClick(e, '/id')}
            className="cursor-pointer flex gap-3 hover:bg-[#FFFFFF1a] rounded-full transition delay-0 duration-200 ease-in-out p-4 items-center"
            href={'/id'}
          >
            <ProfileIcon className="w-[30px] h-[30px]" fill="white" strokeWidth="1.0" />
            Профиль
          </Link>
          <Link
            onClick={(e) => handleLinkClick(e, '/direct')}
            className="cursor-pointer flex gap-3 hover:bg-[#FFFFFF1a] rounded-full transition delay-0 duration-200 ease-in-out p-4 items-center"
            href={'/direct'}
          >
            <ChatIcon className="w-[30px] h-[30px]" fill="white" strokeWidth="1.0" />
            Сообщения
          </Link>
          <Link
            onClick={(e) =>
              handleLinkClick(e, userInfo?.reference ? `/id/${userInfo?.username}/relations` : '/')
            }
            className="cursor-pointer flex gap-3 hover:bg-[#FFFFFF1a] rounded-full transition delay-0 duration-200 ease-in-out p-4 items-center"
            href={userInfo?.reference ? `/id/${userInfo?.username}/relations` : '/'}
          >
            <RelationsIcon className="w-[30px] h-[30px]" fill="white" strokeWidth="1.0" />
            Связи
          </Link>
          <Link
            onClick={(e) => handleLinkClick(e, '/feed')}
            className="cursor-pointer flex gap-3 hover:bg-[#FFFFFF1a] rounded-full transition delay-0 duration-200 ease-in-out p-4 items-center"
            href={'/feed'}
          >
            <FeedIcon className="w-[30px] h-[30px]" fill="white" strokeWidth="1.0" />
            Новостная лента
          </Link>
          <Link
            className="flex gap-3 text-start hover:bg-[#FFFFFF1a] rounded-full transition delay-0 duration-200 ease-in-out p-4 items-center"
            onClick={() => {
              if (!isLogged) {
                openPopupLoginForm();
              } else {
                onClickToCustomization
                  ? onClickToCustomization()
                  : router.push('/customization', { scroll: false });
              }
            }}
            href={'/customization'}
          >
            <CustomizeIcon className="w-[30px] h-[30px]" fill="white" />
            Кастомизация
          </Link>
          <Link
            onClick={(e) => handleLinkClick(e, '/settings')}
            className="cursor-pointer flex gap-3 hover:bg-[#FFFFFF1a] rounded-full transition delay-0 duration-200 ease-in-out p-4 items-center"
            href={'/settings'}
          >
            <SettingsIcon className="w-[30px] h-[30px]" strokeWidth="1.7" fill="white" />
            Настройки
          </Link>
          {!isLogged && (
            <div
              className="cursor-pointer text-white bg-[#2DC96B] font-bold text-start items-center justify-center flex gap-3 rounded-[25px] p-2"
              onClick={() => openPopupLoginForm()}
            >
              Войти в аккаунт
            </div>
          )}
        </ul>
      </div>
    </div>
  );

  const popupLoginForm = (
    <div
      className={classNames(
        isPopupLoginFormOpen ? 'flex' : 'hidden',
        'h-screen w-screen fixed top-0 flex-col items-center left-0 justify-center bg-black/50 overflow-hidden z-40 p-2',
      )}
      onClick={(e) => {
        e.stopPropagation();
        closePopupLoginForm();
      }}
    >
      <div
        className="flex flex-col w-[400px] max-[420px]:w-full bg-white p-5 rounded-3xl overflow-hidden gap-5"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="font-bold text-2xl flex justify-center">Добро пожаловать!</h1>
        <div className="grid gap-3">
          <div className="grid">
            <label className="pl-2">Ваш логин от аккаунта</label>
            <input
              name="login"
              type="text"
              value={loginFormData.login}
              onChange={onChangeLoginFormData}
              placeholder="Введите логин"
              className="outline-none border-gray-500 border-b-2 rounded p-2"
            />
            {!loginFormErrors.login ? null : (
              <div className="text-red-700 flex justify-center">{loginFormErrors.login}</div>
            )}
          </div>
          <div className="grid">
            <label className="pl-2">Пароль</label>
            <input
              name="password"
              type="password"
              value={loginFormData.password}
              onChange={onChangeLoginFormData}
              placeholder="Пароль"
              className="outline-none border-gray-500 border-b-2 rounded p-2"
            />
            {!loginFormErrors.password ? null : (
              <div className="text-red-700 flex justify-center">{loginFormErrors.password}</div>
            )}
          </div>
          <div className="flex flex-row justify-start w-full gap-2 items-center">
            <CheckboxSwiper setIsRememberLogin={setIsRememberLogin} background={'#011627'} />
            <div>Запомнить меня</div>
          </div>
          <Button
            buttonSize="l"
            onClick={() => onSubmitLogin(header)}
            className="text-white relative overflow-hidden bg-[#2DC96B] p-0"
            buttonRadius={'rounded-full'}
            buttonColor={isLoginFormValid ? 'primary' : 'disabled'}
          >
            {!isFetchingLoginResponse ? null : (
              <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-slate-300 to-slate-100 animate-[moveGradient_2s_infinite] opacity-50 blur-xl" />
            )}
            Войти в аккаунт
          </Button>
          <Link
            href={'/reset-password'}
            onClick={() => {
              lockBackground(false);
              router.push('/reset-password', { scroll: false });
            }}
            className="text-[#095F16] text-[14px] font-[800] active:text-[#2F9461] grid justify-center items-center"
          >
            Забыли пароль?
          </Link>
          <div
            onClick={() => {
              closePopupLoginForm();
              openPopupRegisterForm();
            }}
            className="text-blue-500 text-[14px] font-[800] active:text-[#2F9461] grid justify-center items-center cursor-pointer"
          >
            Нет аккаунта, хочу создать
          </div>
        </div>
      </div>
    </div>
  );

  const popupRegisterForm = (
    <div
      className={classNames(
        isPopupSignupFormOpen ? 'flex' : 'hidden',
        'h-screen w-screen fixed gap-3 top-0 items-center left-0 justify-center bg-black/50 overflow-hidden z-40 p-2',
      )}
      onClick={(e) => {
        e.stopPropagation();
        closePopupRegisterForm();
      }}
    >
      <div className="flex gap-3">
        <div
          className="flex flex-col w-[400px] max-[420px]:w-full bg-white p-5 rounded-3xl overflow-hidden gap-5"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h1 className="text-2xl flex font-bold justify-center">Рады новым лицам!</h1>
          <div className="grid gap-3">
            <div className="grid">
              <label className="pl-2">Уникальный никнейм</label>
              <Input
                value={signupFormData.username}
                name="username"
                onChange={(e) => handleInputSignupChange(e, 'username')}
                placeholder="Как вас будут звать?"
                loading={signupInputIsLoading.username}
                hasError={
                  (!!backendSignupErrors.username || !!signupFormErrors.username) && wiggleSignup
                }
                componentClassName={'outline-none border-gray-500 border-b-2 rounded p-2'}
              />
              {!signupFormErrors.username ? null : (
                <div className="text-red-700 w-[90%]">
                  {backendSignupErrors.username || signupFormErrors.username}
                </div>
              )}
            </div>
            <div className="grid">
              <label className="pl-2">Почта</label>
              <Input
                value={signupFormData.email}
                name="email"
                onChange={(e) => handleInputSignupChange(e, 'email')}
                placeholder="Куда присылать уведомления?"
                loading={signupInputIsLoading.email}
                hasError={(!!backendSignupErrors.email || !!signupFormErrors.email) && wiggleSignup}
                componentClassName={'outline-none border-gray-500 border-b-2 rounded p-2'}
              />
              {!signupFormErrors.email ? null : (
                <div className="text-red-700 w-[90%]">
                  {backendSignupErrors.email || signupFormErrors.email}
                </div>
              )}
            </div>
            <label className="pl-2">Дата рождения</label>
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
            <div className="grid">
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
                <div className="text-red-700 w-[90%]">
                  {backendSignupErrors.password || signupFormErrors.password}
                </div>
              )}
            </div>
            <div className="grid">
              <label className="pl-2">Повторите пароль</label>
              <Input
                value={signupRepeatPassword}
                onChange={(e) => setSignupRepeatPassword(e.target.value)}
                placeholder="Введите еще раз, чтобы не забыть"
                hasError={
                  (!!backendSignupErrors.password || !!signupFormErrors.password) && wiggleSignup
                }
                componentClassName={'outline-none border-gray-500 border-b-2 rounded p-2'}
                type="password"
                passwordHidden
              />
              {!signupFormErrors.password ? null : (
                <div className="text-red-700 w-[90%]">
                  {backendSignupErrors.password || signupFormErrors.password}
                </div>
              )}
            </div>
            <div className="flex flex-row justify-center items-center text-center max-[400px]:flex-col max-[400px]:gap-3">
              <Link
                onClick={(e) => {
                  lockBackground(false);
                  router.push('/policy', { scroll: false });
                }}
                className="z-10 text-[#2F9461] underline decoration-1 font-[700] cursor-pointer"
                href={'/policy'}
              >
                Политикой Конфиденциальности
              </Link>
              <Link
                onClick={(e) => {
                  lockBackground(false);
                  router.push('/terms', { scroll: false });
                }}
                className="z-10 text-[#2F9461] underline decoration-1 font-[700] cursor-pointer"
                href={'/terms'}
              >
                Пользовательским соглашением
              </Link>
            </div>
            <Button
              buttonSize="l"
              onClick={() => onSubmitSignup(header)}
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
            <div
              onClick={() => {
                closePopupRegisterForm();
                openPopupLoginForm();
              }}
              className="text-blue-500 text-[14px] font-[800] active:text-[#2F9461] grid justify-center items-center cursor-pointer"
            >
              У меня есть аккаунт, хочу войти!
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {desktopHeader}
      {mobileHeader}
      {isLogged ? null : (
        <>
          {popupLoginForm}
          {popupRegisterForm}
        </>
      )}
    </>
  );
};
export default MainHeader;
