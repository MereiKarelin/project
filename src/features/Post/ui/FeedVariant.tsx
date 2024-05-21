'use client';
import { DownArrowIcon } from '@/shared/assets/icons';
import FlameIcon from '@/shared/assets/icons/FlameIcon';
import HouseIcon from '@/shared/assets/icons/HouseIcon';
import InternetPlanetIcon from '@/shared/assets/icons/InternetPlanetIcon';
import TwoStarIcon from '@/shared/assets/icons/TwoStarsIcon';
import classNames from 'classnames';
import Link from 'next/link';
import { useState } from 'react';

export const FeedVariant = () => {
  const [isOpenedFeedVariant, setIsOpenedFeedVariant] = useState(false);

  return (
    <div
      className="relative grid p-2 bg-white rounded items-center font-semibold w-[514px] max-[514px]:w-full self-center cursor-pointer select-none"
      onClick={() => setIsOpenedFeedVariant((prev) => !prev)}
    >
      <div className="flex justify-between hover:bg-gray-100 p-2 rounded gap-3">
        <div className="flex gap-3">
          <HouseIcon className="w-6 h-6" strokeWidth="1.5" />
          <span className="font-medium">Мои друзья и подписки</span>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 max-[514px]:hidden">Глобальные ленты</span>
          <DownArrowIcon className="w-6 h-6" fill="gray" />
        </div>
      </div>
      <div className={classNames(isOpenedFeedVariant ? 'grid gap-3' : 'hidden')}>
        <span className="text-center text-sm text-gray-400 p-2">
          Осторожно, NSFW контент присутствует
        </span>
        <Link
          className="flex gap-3 relative hover:bg-gray-100 p-2 rounded items-center"
          href={'/explore'}
        >
          <InternetPlanetIcon className="w-6 h-6" strokeWidth="1.5" />
          <span className="font-medium">Новое</span>
        </Link>
        <Link
          className="flex gap-3 relative hover:bg-gray-100 p-2 rounded items-center"
          href={'/trending'}
        >
          <FlameIcon className="w-6 h-6" strokeWidth="1.5" />
          <span className="font-medium">Популярное</span>
        </Link>
        <Link
          className="flex gap-3 relative hover:bg-gray-100 p-2 rounded items-center bg-gradient-to-r from-indigo-200 from-10% via-sky-200 via-30% to-emerald-400 to-90%  bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500"
          href={'/discover'}
        >
          <TwoStarIcon className="w-6 h-6" strokeWidth="1.5" fill="black" />
          <span className="font-medium text-black">Профили</span>
        </Link>
      </div>
    </div>
  );
};
