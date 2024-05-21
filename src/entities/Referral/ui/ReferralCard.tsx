'use client';
import { IReferral } from '@/entities/Referral/types';
import { GetInvitedUsersByReferral } from '@/features/Referral/GetInvitedUsersByReferral/GetInvitedUsersByReferral';
import { DownArrowIcon } from '@/shared/assets/icons';
import CopyIcon from '@/shared/assets/icons/CopyIcon';
import 'moment/locale/ru';
import moment from 'moment/moment';
import { useState } from 'react';

interface IProps {
  referral: IReferral;
}

export const ReferralCard = ({ referral }: IProps) => {
  const [invitedUsersListOpen, setInvitedUsersListOpen] = useState(false);

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
  return (
    <div className="grid grid-cols-2 bg-white p-2 rounded w-full gap-3 justify-center items-center">
      <div>
        <span
          className="flex gap-3 text-[#00A3FF] cursor-pointer font-bold"
          onClick={(e) => {
            void navigator.clipboard
              .writeText(`${linkWebsite}/signup/${referral.reference}`)
              .then(() => {
                alert('Ссылка скопирована');
              });
          }}
        >
          Скопировать рефералку <CopyIcon fill={'#00A3FF'} strokeWidth="2" />
        </span>
        <span>
          Создана:{' '}
          {moment(referral?.created_at)
            .locale('ru')
            .fromNow()}
        </span>
      </div>
      <div
        className="cursor-pointer text-[#2DC96B] flex justify-end font-semibold items-center select-none"
        onClick={() => setInvitedUsersListOpen((prev) => !prev)}
      >
        Зарегистрировались <DownArrowIcon className="w-6 h-6" fill={'#2DC96B'} />
      </div>
      <div className={invitedUsersListOpen ? 'col-span-2 grid gap-3' : 'hidden'}>
        <hr />
        <GetInvitedUsersByReferral referralReference={referral.reference} />
      </div>
    </div>
  );
};
