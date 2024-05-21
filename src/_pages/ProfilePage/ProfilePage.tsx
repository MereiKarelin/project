'use client';
import classNames from 'classnames';
import { useQRCode } from 'next-qrcode';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { IProfile } from '@/entities/Profile';
import { ITemplate } from '@/entities/Template';
import { useAuth } from '@/features';
import { TemplateMenu } from '@/features/TemplateMenu/TemplateMenu';
import { getProfileByUsernameHandler, getProfileTemplatesHandler } from '@/shared/api/profile';
import { NotesMinimalistic } from '@/shared/assets/icons';
import CopyIcon from '@/shared/assets/icons/CopyIcon';
import QrCodeIcon from '@/shared/assets/icons/QrCodeIcon';
import { defaultBGImage } from '@/shared/consts';
import { useAppSelector } from '@/shared/store/hooks';
import { userSelector } from '@/shared/store/selectors/user';
import { Button } from '@/shared/ui/ButtonNew';
import { EllipsisSpinner } from '@/shared/ui/Spinners';
import { changeBackground, lockBackground } from '@/shared/utils';
import { logBackendError } from '@/shared/utils/error';
import MainHeader from '@/widgets/MainHeader/MainHeader';
import { Profile } from '@/widgets/Profile/ui/Profile/Profile';
import { IObject } from '@daybrush/utils';

import { DeleteConfirmationDialog } from './ui/DeleteConfirmationDialog';

type PropTypes = {
  username?: string;
  header: IObject<string>;
};

export const ProfilePage = ({ username, header }: PropTypes) => {
  const router = useRouter();
  const [profileInfo, setProfileInfo] = useState<IProfile>();
  const [templates, setTemplates] = useState<ITemplate[]>();
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<ITemplate>();
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const { Image } = useQRCode();
  const { isLogged, executeQueryCallback } = useAuth();
  const [isDeletionConfirmed, setIsDeletionConfirmed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userInfo = useAppSelector(userSelector);
  const [isLoading, setIsLoading] = useState(true);

  const onClickCustomize = () => {
    router.push('/customization/profile', { scroll: false });
  };

  const fetchTemplates = useCallback(() => {
    if (!isLogged) return;
    executeQueryCallback((accessToken: string) => {
      const dateCursorId = new Date();
      try {
        getProfileTemplatesHandler(dateCursorId, accessToken)
          .then((res) => {
            setTemplates(res.items);
          })
          .catch((err) => console.error(err));
      } catch (err) {
        console.error(err);
      }
    });
  }, [isLogged, executeQueryCallback]);

  useEffect(() => {
    const controllerInstance = new AbortController();

    if (!username) return;

    setIsLoading(true);
    getProfileByUsernameHandler(username, controllerInstance)
      .then((profile) => {
        if (!window && !profile) {
          return;
        }

        try {
          if (userInfo?.username === username) {
            fetchTemplates();
          }

          if (profile?.template) {
            //assigning to new var, cause typescript complaining about null value
            const template = profile.template;
            setActiveTemplate(() => template);
            changeBackground(template.background_url);
          } else {
            changeBackground(defaultBGImage);
          }
          setProfileInfo(profile);
        } catch (err) {
          console.error(err);
        }
      })
      .catch((error) => {
        logBackendError(error, 'fetchProfileByUsername failed');
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      changeBackground(defaultBGImage);
      //use abort controller to abort axios fetchProfileByUsername call if it is being fetched
      controllerInstance.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openQrCodeModal = () => {
    setIsQrCodeModalOpen(true);
    lockBackground(true);
  };

  const closeQrCodeModal = () => {
    setIsQrCodeModalOpen(false);
    lockBackground(false);
  };

  let linkWebsite: string;
  if (
    process.env.NODE_ENV == 'development' &&
    process.env.BACKEND_API_URL == 'https://test-api.yourbandy.com'
  ) {
    linkWebsite = 'http://localhost:3000';
  } else if (
    process.env.NODE_ENV == 'production' &&
    process.env.BACKEND_API_URL == 'https://test-api.yourbandy.com'
  ) {
    linkWebsite = 'https://test.yourbandy.com';
  } else {
    linkWebsite = 'https://yourbandy.com';
  }

  const qrCodeModal = (
    <div
      className={classNames(
        isQrCodeModalOpen ? 'flex' : 'hidden',
        'h-screen w-screen fixed top-0 flex-col items-center left-0 justify-center bg-black/50 overflow-hidden z-50 p-2',
      )}
      onClick={(e) => {
        e.stopPropagation();
        closeQrCodeModal();
      }}
    >
      <div
        className="flex flex-col w-[400px] max-[420px]:w-full rounded-3xl overflow-hidden gap-5 border-[12px] border-[#00ff69]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Image
          text={
            process.env.BACKEND_API_URL == 'https://test-api.yourbandy.com' &&
            process.env.NODE_ENV == 'development'
              ? `http://localhost:3000/id/${profileInfo?.user.username}`
              : process.env.BACKEND_API_URL == 'https://test-api.yourbandy.com' &&
                  process.env.NODE_ENV == 'production'
                ? `https://test.yourbandy.com/id/${profileInfo?.user.username}`
                : `https://yourbandy.com/id/${profileInfo?.user.username}`
          }
          options={{
            type: 'image/jpeg',
            quality: 1,
            errorCorrectionLevel: 'M',
            margin: 3,
            scale: 1,
            width: 1000,
            color: {
              dark: '#00ff69',
              light: '#011627',
            },
          }}
        />
      </div>
      <span
        className="flex gap-3 text-white cursor-pointer font-bold"
        onClick={(e) => {
          void navigator.clipboard
            .writeText(`${linkWebsite}/id/${profileInfo?.user.username}`)
            .then(() => {
              alert('Ссылка скопирована');
            });
        }}
      >
        Скопировать ссылку на профиль <CopyIcon fill={'white'} strokeWidth="2.5" />
      </span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <EllipsisSpinner />
      </div>
    );
  }

  if (!profileInfo) {
    return (
      <>
        <MainHeader onClickToCustomization={onClickCustomize} header={header} />
        <div className="flex justify-center p-2">
          <span className="font-bold text-lg gap-2 flex">
            <span>Пользователь не найден по id</span>-<span>@{username}</span>
          </span>
          {/* отобразить список рекомендаций, список пользователей которые похожи по никнейму */}
          <div></div>
        </div>
      </>
    );
  }

  return (
    <>
      {qrCodeModal}
      <MainHeader onClickToCustomization={onClickCustomize} header={header} />
      <div className="relative grid h-auto">
        {userInfo?.reference === profileInfo?.user.reference && templates && (
          <div className="absolute flex flex-col top-3 left-3 gap-3 w-[320px] bg-[#BEE8FF] rounded-3xl z-20">
            <div className="flex flex-col gap-0">
              <Button
                onClick={() => setIsTemplateDropdownOpen((prev) => !prev)}
                className={classNames(
                  'relative flex flex-row gap-3 w-full items-center justify-center',
                  'rounded-3xl font-bold h-min bg-[#00A3FF] text-base tracking-wide py-1 px-7 text-white',
                  !isTemplateDropdownOpen && 'shadow-[0_3px_10px_#818181]',
                )}
              >
                <NotesMinimalistic />
                Мои Шаблоны
              </Button>

              <TemplateMenu
                fetchTemplates={fetchTemplates}
                isTemplateDropdownOpen={isTemplateDropdownOpen}
                templates={templates}
                setActiveTemplate={setActiveTemplate}
                isConfirmed={isDeletionConfirmed}
                setIsConfirmed={setIsDeletionConfirmed}
                setIsModalOpen={setIsModalOpen}
              />
            </div>
          </div>
        )}
        <div
          className="absolute right-0 text-blue-500 bg-[#00A3FF] p-2 rounded-xl m-2 cursor-pointer max-[400px]:mt-[60px] z-10"
          onClick={() => {
            openQrCodeModal();
          }}
        >
          <QrCodeIcon fill={'white'} />
        </div>
        {profileInfo && <Profile profileInfo={profileInfo} activeTemplate={activeTemplate} />}
        {/*TODO: Сделать редирект на 404 Profile Not Found*/}
      </div>
      <DeleteConfirmationDialog
        isModalOpen={isModalOpen}
        isConfirmed={isDeletionConfirmed}
        setIsConfirmed={setIsDeletionConfirmed}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};
