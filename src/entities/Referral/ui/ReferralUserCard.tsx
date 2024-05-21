import moment from 'moment';

import { IReferralUser } from '@/entities/Referral/types';
import { defaultUserAvatar } from '@/shared/consts';

interface IProps {
  referralUser: IReferralUser;
}

export const ReferralUserCard = ({ referralUser }: IProps) => {
  return (
    <div className="flex gap-3">
      <img
        src={referralUser.avatar_url || defaultUserAvatar}
        alt="avatar"
        className="w-10 rounded-full"
      />
      <div className="grid">
        <div className="text-sm">
          {referralUser.fullname ? referralUser.fullname : '@' + referralUser.username}
        </div>
        <div className="text-sm text-[#2DC96B]">
          Зарегистрировался(лась):{' '}
          {moment(referralUser?.invited_at)
            .locale('ru')
            .fromNow()}
        </div>
      </div>
    </div>
  );
};
