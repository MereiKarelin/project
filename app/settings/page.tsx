import { Metadata } from 'next';
import { headers } from 'next/headers';

import { SettingsPage } from '@/_pages';
import { RequireAuth } from '@/shared/components';
import { MainHeader } from '@/widgets';

export const metadata: Metadata = {
  title: 'Настройки',
  description: 'Настройки аккаунта и безопасности',
};

const Settings = () => {
  const headerList = headers();
  const header = Object.fromEntries(headerList);

  return (
    <RequireAuth>
      <>
        <MainHeader header={header} />
        <SettingsPage />
      </>
    </RequireAuth>
  );
};
export default Settings;
