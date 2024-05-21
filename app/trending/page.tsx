import { Metadata } from 'next';
import { headers } from 'next/headers';

import TrendingPage from '@/_pages/Feeds/TrendingPage';

export const metadata: Metadata = {
  title: 'Популярное',
  description: 'Глоабльная лента популярных постов',
};

const Trending = () => {
  const headerList = headers();
  const header = Object.fromEntries(headerList);

  return <TrendingPage header={header} />;
};

export default Trending;
