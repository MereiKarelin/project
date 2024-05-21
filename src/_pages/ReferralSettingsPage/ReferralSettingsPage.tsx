'use client';

import { useRouter } from 'next/navigation';

import { GetReferrals } from '@/features/Referral/GetReferrals/GetReferrals';
import { RequireAuth } from '@/shared/components';
import MainHeader from '@/widgets/MainHeader/MainHeader';
import { IObject } from '@daybrush/utils';

type PropTypes = {
  header: IObject<string>;
};

export const ReferralSettingsPage = ({ header }: PropTypes) => {
  const router = useRouter();

  return (
    <RequireAuth>
      <>
        <MainHeader
          onClickToCustomization={() => router.push('/customization/post', { scroll: false })}
          header={header}
        />
        <div className="grid min-[960px]:justify-center items-center">
          <GetReferrals />
        </div>
      </>
    </RequireAuth>
  );
};
