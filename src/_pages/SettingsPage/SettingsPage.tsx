'use client';
import classNames from 'classnames';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { IProfile } from '@/entities/Profile';
import { IPrivateUser } from '@/entities/User';
import { useAuth } from '@/features/Auth/useAuth/useAuth';
import { UploadAvatar } from '@/features/UploadAvatar/UploadAvatar';
import { getProfileByUsernameHandler, updateProfileHandler } from '@/shared/api/profile';
import { getUserMeInfo, updateFullnameHandler, updateUsernameHandler } from '@/shared/api/user';
import { ExitIcon } from '@/shared/assets/icons';
import CheckMark from '@/shared/assets/icons/CheckMark';
import { defaultUserAvatar } from '@/shared/consts';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { userSelector } from '@/shared/store/selectors/user';
import { updateUserData } from '@/shared/store/slices/user';
import { Gender } from '@/shared/types';
import { Button } from '@/shared/ui/ButtonNew';
import { EllipsisSpinner } from '@/shared/ui/Spinners';
import { getLocalUserData } from '@/shared/utils';

type ProfileData = {
  maritalStatus: string;
  gender: Gender;
  city: string;
  country: string;
  aboutMe: string;
  jobTitle: string;
};

type MaritalStatus =
  | 'NOTSELECTED'
  | 'INLOVE'
  | 'MARRIED'
  | 'WIDOW'
  | 'SINGLE'
  | 'ENGAGED'
  | 'OPENRELATIONSHIP'
  | 'ITSCOMPLICATED'
  | 'DIVORCED'
  | 'INRELATIONSHIP'
  | 'CIVILPARTNERSIP';

const maritalStatuses: { [key in MaritalStatus]: { [key in Gender]: string } } = {
  NOTSELECTED: { MALE: 'не выбрано', FEMALE: 'не выбрано', OTHER: 'не выбрано' },
  INLOVE: { MALE: 'влюблен', FEMALE: 'влюблена', OTHER: 'любовь' },
  MARRIED: { MALE: 'женат', FEMALE: 'замужем', OTHER: 'в браке' },
  WIDOW: { MALE: 'вдовец', FEMALE: 'вдова', OTHER: 'потерял партнера' },
  SINGLE: { MALE: 'не женат', FEMALE: 'не замужем', OTHER: 'без партнера' },
  ENGAGED: { MALE: 'помолвлен', FEMALE: 'помолвлена', OTHER: 'в помолвке' },
  OPENRELATIONSHIP: {
    MALE: 'в поисках отношений',
    FEMALE: 'в поисках отношений',
    OTHER: 'в поисках отношений',
  },
  ITSCOMPLICATED: { MALE: 'все сложно', FEMALE: 'все сложно', OTHER: 'все сложно' },
  DIVORCED: { MALE: 'разведен', FEMALE: 'разведена', OTHER: 'в разводе' },
  INRELATIONSHIP: { MALE: 'встречается', FEMALE: 'встречается', OTHER: 'встречается' },
  CIVILPARTNERSIP: {
    MALE: 'в гражданском браке',
    FEMALE: 'в гражданском браке',
    OTHER: 'в гражданском браке',
  },
};

type FormData = {
  username: string;
  fullname: string;
  avatarUrl: string;
} & ProfileData;

const TextInput = ({
  value,
  id,
  setFormData,
}: {
  value: string;
  id: keyof FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
}) => (
  <input
    className="bg-gray-400 rounded-full pl-2 pr-2"
    value={value}
    onChange={(e) => {
      setFormData((state) => ({ ...state, [id]: e.target.value }));
    }}
  />
);

const isProfileDataChanged = (initData: IProfile | undefined, data: IProfile) => {
  if (!initData) return true;
  const fields = ['maritalStatus', 'gender', 'city', 'country', 'aboutMe', 'jobTitle'];

  return fields.some((item) => {
    const field = item as keyof IProfile;
    const initValue = initData[field] ?? field === 'gender' ? 'MALE' : '';
    const value = data[field] ?? '';
    return initValue !== value;
  });
};

const SettingsPage = () => {
  const [initData, setInitData] = useState<{
    user: IPrivateUser | undefined;
    profile: IProfile | undefined;
  } | null>(null);

  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { logout, executeQueryCallback, isLoading: isLoadingAuth } = useAuth();
  const [formData, setFormData] = useState<FormData>({} as FormData);
  const user = useAppSelector(userSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoadingAuth) return;
    executeQueryCallback(async (accessToken: string) => {
      try {
        const userInfo: IPrivateUser = await getUserMeInfo(accessToken);
        const profile: IProfile = await getProfileByUsernameHandler(user.username);

        setInitData(() => ({
          user: userInfo,
          profile: profile,
        }));

        const gender = (profile.gender ?? 'MALE') as Gender;

        setFormData((state) => ({
          ...state,
          username: userInfo.username,
          fullname: userInfo.fullname,
          avatarUrl: userInfo?.avatar?.small_url ?? defaultUserAvatar,
          maritalStatus: profile.marital_status ?? 'NOTSELECTED',
          gender: gender,
          city: profile.city ?? '',
          country: profile.country ?? '',
          aboutMe: profile.about_me ?? '',
          jobTitle: profile.job_title ?? '',
        }));
      } catch (error) {
        console.error(`Initialization failed :${error}`);
      }
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAuth]);

  const saveChanges = () => {
    if (isSaving) return;
    executeQueryCallback(async (accessToken: string) => {
      try {
        setIsSaving(true);
        let isChanded = false;
        let userData: IPrivateUser = getLocalUserData() ?? ({} as IPrivateUser);
        if (formData.username != initData?.user?.username) {
          await updateUsernameHandler(formData.username, accessToken);
          userData = { ...userData, username: formData.username };
          isChanded = true;
        }
        if (formData.fullname != initData?.user?.fullname) {
          await updateFullnameHandler(formData.fullname, accessToken);
          userData = { ...userData, fullname: formData.fullname };
          isChanded = true;
        }

        const isProfileChanged = isProfileDataChanged(
          initData?.profile,
          formData as unknown as IProfile,
        );
        if (isProfileChanged) {
          const payload = {
            marital_status:
              formData.maritalStatus === 'NOTSELECTED' ? null : formData.maritalStatus,
            gender: formData.gender || null,
            city: formData.city || null,
            country: formData.country || null,
            about_me: formData.aboutMe || null,
            job_title: formData.jobTitle || null,
          };
          isChanded = true;
          await updateProfileHandler(payload, accessToken);
        }
        dispatch(updateUserData({ data: userData }));
        setIsSaved(isChanded);
        alert('Настройки сохранены');
      } catch (error) {
        console.error(`Settings save failed: ${error}`);
        alert('Не удалось сохранить настройки');
      }

      setIsSaving(false);
    });
  };

  useEffect(() => {
    if (isLoading) return;
    setIsSaved(false);
  }, [isLoading, formData]);

  if (isLoading) return <EllipsisSpinner />;

  return (
    <div className="grid gap-3 justify-center items-center">
      <h1>Аватарка</h1>
      <label htmlFor="file-input" className="grid justify-center">
        <Image
          src={formData.avatarUrl}
          alt="avatar"
          width={0}
          height={0}
          sizes="100vw"
          className="flex-shrink-0 w-[100px] h-[100px]  rounded-full"
        />
      </label>
      <UploadAvatar id="file-input" />
      <label className="grid">
        Никнейм
        <TextInput value={formData.username} id="username" setFormData={setFormData} />
      </label>
      <label className="grid">
        Полное имя
        <TextInput value={formData.fullname} id="fullname" setFormData={setFormData} />
      </label>
      <label className="grid">
        Семейное положение
        <select
          value={formData.maritalStatus || 'none_selected'}
          onChange={(e) => setFormData((state) => ({ ...state, maritalStatus: e.target.value }))}
          className="grow py-0 pl-1 w-full h-6 rounded-full border border-black"
        >
          {Object.keys(maritalStatuses).map((status) => (
            <option key={status} value={status}>
              {maritalStatuses[status as MaritalStatus][formData.gender || 'MALE']}
            </option>
          ))}
        </select>
      </label>
      <label className="grid">
        Обо мне
        <textarea
          placeholder="Расскажите о себе..."
          onChange={(e) => setFormData((state) => ({ ...state, aboutMe: e.target.value }))}
          maxLength={1000}
          value={formData.aboutMe}
          className="w-full px-2 overflow-scroll resize-none h-[200px]"
        />
      </label>
      <label className="grid">
        Пол
        <fieldset className="flex flex-row gap-3">
          <label className="flex flex-row gap-1">
            <input
              type="radio"
              checked={formData.gender == 'MALE'}
              onChange={() => setFormData((state) => ({ ...state, gender: 'MALE' }))}
              value="MALE"
            />
            Мужской
          </label>
          <label className="flex flex-row gap-1">
            <input
              type="radio"
              checked={formData.gender == 'FEMALE'}
              onChange={() => setFormData((state) => ({ ...state, gender: 'FEMALE' }))}
              value="FEMALE"
            />
            Женский
          </label>
          <label className="flex flex-row gap-1">
            <input
              type="radio"
              checked={formData.gender == 'OTHER'}
              onChange={() => setFormData((state) => ({ ...state, gender: 'OTHER' }))}
              value="OTHER"
            />
            Другое
          </label>
        </fieldset>
      </label>
      <label className="grid">
        Город
        <TextInput value={formData.city} id="city" setFormData={setFormData} />
      </label>
      <label className="grid">
        Страна
        <TextInput value={formData.country} id="country" setFormData={setFormData} />
      </label>
      <label className="grid">
        Профессия
        <TextInput value={formData.jobTitle} id="jobTitle" setFormData={setFormData} />
      </label>
      <Button size="s" textColor="secondary" onClick={saveChanges}>
        <div
          className={classNames(
            'absolute flex-row justify-center items-center',
            isSaving ? 'flex' : 'hidden',
          )}
        >
          <EllipsisSpinner />
        </div>
        Сохранить
        {isSaved ? <CheckMark fill="green" /> : null}
      </Button>

      <Button
        className="bg-blue-500 text-white p-2 rounded-full text-center"
        href={'/settings/referral'}
      >
        Реферальная система
      </Button>
      <button
        onClick={logout}
        className="flex flex-row bg-white rounded-full gap-3 drop-shadow justify-center items-center p-2 w-auto"
      >
        <ExitIcon className="w-[22px] h-[22px]" fill="#FF3A3A" />
        <strong className="text-[#FF3A3A]">Выйти из аккаунта</strong>
      </button>
    </div>
  );
};
export default SettingsPage;
