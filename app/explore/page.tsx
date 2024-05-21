import { Metadata } from 'next';
import { headers } from 'next/headers';

import ExplorePage from '@/_pages/Feeds/ExplorePage';

export const metadata: Metadata = {
  title: 'Новое',
  description: 'Глоабльная лента новых постов',
};

const Explore = () => {
  const headerList = headers();
  const header = Object.fromEntries(headerList);

  return <ExplorePage header={header} />;
};

export default Explore;
