'use client';
import Link from 'next/link';

import { _FeedLayout } from '@/_pages/Feeds/_FeedLayout';
import { FeedPosts } from '@/features/Post/GetFeedPosts/GetFeedPosts';
import { FeedVariant } from '@/features/Post/ui/FeedVariant';
import YandexAdsBar from '@/widgets/YandexAdsBar/YandexAdsBar';
import { IObject } from '@daybrush/utils';

type PropTypes = {
  header: IObject<string>;
};

const FeedPage = ({ header }: PropTypes) => {
  const LeftSidebar = () => {
    return (
      <div className="mt-4">
        <Link
          href={'/customization/post'}
          className="sticky top-[70px] max-[1020px]:hidden pr-4 pl-4 rounded-full bg-green-500 font-bold text-white p-1 h-fit bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500"
        >
          Создать пост
        </Link>
      </div>
    );
  };

  const MainContent = () => {
    return (
      <>
        <FeedVariant />
        <FeedPosts />
      </>
    );
  };

  const RightSidebar = () => {
    return (
      <div className="w-[300px] max-[1154px]:hidden sticky top-[70px] h-[600px] rounded-3xl">
        <YandexAdsBar yandexId={'yandex_rtb_R-A-6580598-2'} blockId={'R-A-6580598-2'} />
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

export default FeedPage;
