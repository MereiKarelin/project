import { Metadata } from 'next';
import { headers } from 'next/headers';

import DiscoverPage from '@/_pages/Feeds/DiscoverPage';

export const metadata: Metadata = {
  title: 'Открытия',
  description: 'Глоабльная лента кастомизированных профилей',
};

const Discover = () => {
  const headerList = headers();
  const header = Object.fromEntries(headerList);

  return <DiscoverPage header={header} />;
};

export default Discover;
