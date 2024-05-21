import { headers } from 'next/headers';

import DiscoverPage from '@/_pages/Feeds/DiscoverPage';
import { RequireAnonymous } from '@/shared/components/RequireAnonymous/RequireAnonymous';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://yourbandy.com'),
  title: 'Добро пожаловать',
  description: 'Присоединяйтесь в сообщество открытых и творческих людей!',
};

const Home = () => {
  const headerList = headers();
  const header = Object.fromEntries(headerList);
  return (
    <RequireAnonymous>
      {/*<>*/}
      {/*  <div className="hidden lg:block">*/}
      {/*    <DesktopHome />*/}
      {/*  </div>*/}
      {/*  <div className="block lg:hidden">*/}
      {/*    <MobileHome />*/}
      {/*  </div>*/}
      {/*</>*/}
      <>
        <DiscoverPage header={header} />
      </>
    </RequireAnonymous>
  );
};

export default Home;
