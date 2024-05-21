import { Metadata } from 'next';
import { headers } from 'next/headers';

import { RelationsPage } from '@/_pages';

export const metadata: Metadata = {
  title: 'Cвязи',
  description: 'Cвязи пользователя, его друзья и подписчики, а также подписки пользователя',
};

const Relations = ({ params }: { params: { username: string } }) => {
  const headerList = headers();
  const header = Object.fromEntries(headerList);

  return <RelationsPage username={params.username} header={header} />;
};

export default Relations;
