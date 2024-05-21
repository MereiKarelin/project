import { headers } from 'next/headers';

import { ReferralSettingsPage } from '@/_pages';

const ReferralSettings = () => {
  const headerList = headers();
  const header = Object.fromEntries(headerList);

  return <ReferralSettingsPage header={header} />;
};
export default ReferralSettings;
