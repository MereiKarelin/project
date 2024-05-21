import { headers } from 'next/headers';

import { SignUpByReferralPage } from '@/_pages';

const SignUpByReferral = ({ params }: { params: { referralReference: string } }) => {
  const headerList = headers();
  const header = Object.fromEntries(headerList);
  return <SignUpByReferralPage referralReference={params.referralReference} header={header} />;
};

export default SignUpByReferral;
