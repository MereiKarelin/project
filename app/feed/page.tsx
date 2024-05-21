import { Metadata } from 'next';
import { headers } from 'next/headers';

import FeedPage from '@/_pages/Feeds/FeedPage';
import { RequireAuth } from '@/shared/components';

export const metadata: Metadata = {
  title: 'Моя Лента',
  description: 'Самые свежие новости от ваших друзей и подписчиков',
};

const Feed = () => {
  const headerList = headers();
  const header = Object.fromEntries(headerList);

  return (
    <RequireAuth>
      <FeedPage header={header} />
    </RequireAuth>
  );
};

export default Feed;
