'use client';
import Link from 'next/link';

import { _FeedLayout } from '@/_pages/Feeds/_FeedLayout';
import { GetCustomizationProfiles } from '@/features/Profile/GetCustomizationProfiles/GetCustomizationProfiles';
import TwoStarIcon from '@/shared/assets/icons/TwoStarsIcon';
import YandexAdsBar from '@/widgets/YandexAdsBar/YandexAdsBar';
import { IObject } from '@daybrush/utils';

type PropTypes = {
  header: IObject<string>;
};

const DiscoverPage = ({ header }: PropTypes) => {
  const LeftSidebar = () => {
    return (
      <div className="mt-4">
        <Link
          href={'/customization/profile'}
          className="sticky top-[70px] max-[1020px]:hidden pr-4 pl-4 rounded-full bg-green-500 font-bold text-white p-1 h-fit bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500"
        >
          Редактировать профиль
        </Link>
      </div>
    );
  };

  const MainContent = () => {
    return (
      <div className="grid gap-3 rounded font-medium cursor-pointer w-full">
        <div className="flex p-2 bg-white gap-3 justify-between items-center h-fit">
          <div className="flex gap-3 justify-center items-center">
            <TwoStarIcon className="w-6 h-6" strokeWidth="2" />
            <span>Кастомизированные профили</span>
          </div>
          <Link href={'/feed'} className="text-sm text-gray-500 hover:bg-gray-100 p-2 rounded-full">
            Моя лента
          </Link>
        </div>
        <GetCustomizationProfiles />
      </div>
    );
  };

  const RightSidebar = () => {
    return (
      <div className="w-[300px] max-[1154px]:hidden sticky top-[70px] h-[600px] rounded-3xl">
        <YandexAdsBar yandexId={'yandex_rtb_R-A-6580598-1'} blockId={'R-A-6580598-1'} />
      </div>
    );
  };

  return (
    <_FeedLayout
      leftBar={<LeftSidebar />}
      mainContent={<MainContent />}
      rightBar={<RightSidebar />}
      header={header}
    />
  );
};

export default DiscoverPage;
