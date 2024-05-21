import { Metadata } from 'next';
import { headers } from 'next/headers';

import DirectPage from '@/_pages/DirectPage';
import { RequireAuth } from '@/shared/components';

export const metadata: Metadata = {
  title: 'Личные сообщения',
  description: 'Общайтесь с друзьями и подписчиками',
};

const Direct = () => {
  const headerList = headers();
  const header = Object.fromEntries(headerList);

  return (
    <RequireAuth>
      <DirectPage header={header} />
    </RequireAuth>
  );
};

export default Direct;
