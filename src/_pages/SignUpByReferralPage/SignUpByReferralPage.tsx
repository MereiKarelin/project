'use client';

import { SignupUser } from '@/processes/SignupUser/SignupUser';
import { RequireAnonymous } from '@/shared/components/RequireAnonymous/RequireAnonymous';
import { IObject } from '@daybrush/utils';

type PropTypes = {
  referralReference: string;
  header: IObject<string>;
};

export const SignUpByReferralPage = ({ referralReference, header }: PropTypes) => {
  return (
    <RequireAnonymous>
      <>
        <SignupUser referralReference={referralReference} header={header} />;
      </>
    </RequireAnonymous>
  );
};
