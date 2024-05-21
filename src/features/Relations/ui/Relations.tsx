'use client';
import classNames from 'classnames';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { GetFollowers } from '@/features/Relations/GetFollowers/GetFollowers';
import { GetFollowing } from '@/features/Relations/GetFollowing/GetFollowing';
import { GetFriends } from '@/features/Relations/GetFriends/GetFriends';
import MainHeader from '@/widgets/MainHeader/MainHeader';
import { IObject } from '@daybrush/utils';

type PropTypes = {
  header: IObject<string>;
  userId: string;
};
export const Relations = ({ header, userId }: PropTypes) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedList, setSelectedList] = useState('friends');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    const sortedParam = searchParams.get('sort');
    setSelectedList(sortedParam || 'friends');
  }, [searchParams]);

  const desktop = (
    <div className="grid items-start gap-3 grid-cols-[1fr_514px_1fr] justify-around max-lg:hidden h-full p-5">
      <div className="grid justify-end grid-rows-3 items-center mb-5 sticky top-[80px] gap-3">
        <strong
          className={classNames(
            'font-medium w-[120px] p-2 grid justify-center rounded-full cursor-pointer bg-[#D9D9D9]',
            selectedList == 'friends' ? 'font-semibold !bg-[#2DC96B] text-white' : '',
          )}
          onClick={() => {
            setSelectedList('friends');
            router.push(pathname + '?' + createQueryString('sort', 'friends'));
          }}
        >
          Друзья
        </strong>
        <strong
          className={classNames(
            'font-medium w-[120px] p-2 grid justify-center rounded-full cursor-pointer bg-[#D9D9D9]',
            selectedList == 'followers' ? 'font-semibold !bg-[#2DC96B] text-white' : '',
          )}
          onClick={() => {
            setSelectedList('followers');
            router.push(pathname + '?' + createQueryString('sort', 'followers'));
          }}
        >
          Подписчики
        </strong>
        <strong
          className={classNames(
            'font-medium w-[120px] p-2 grid justify-center rounded-full cursor-pointer bg-[#D9D9D9]',
            selectedList == 'following' ? 'font-semibold !bg-[#2DC96B] text-white' : '',
          )}
          onClick={() => {
            setSelectedList('following');
            router.push(pathname + '?' + createQueryString('sort', 'following'));
          }}
        >
          Подписки
        </strong>
      </div>
      <div className={selectedList == 'friends' ? 'block' : 'hidden'}>
        <GetFriends userId={userId} selectedList={selectedList} />
      </div>
      <div className={selectedList == 'followers' ? 'block' : 'hidden'}>
        <GetFollowers userId={userId} selectedList={selectedList} />
      </div>
      <div className={selectedList == 'following' ? 'block' : 'hidden'}>
        <GetFollowing userId={userId} selectedList={selectedList} />
      </div>
    </div>
  );

  const mobile = (
    <div className="hidden max-lg:grid p-5 max-sm:p-[5px]">
      <div className="grid justify-items-center grid-cols-3 items-center mb-5">
        <strong
          className={classNames(
            'font-medium rounded-full p-2 pl-4 pr-4 cursor-pointer',
            selectedList == 'friends'
              ? 'underline font-bold text-md text-white bg-green-500'
              : 'text-sm',
          )}
          onClick={() => setSelectedList('friends')}
        >
          Друзья
        </strong>
        <strong
          className={classNames(
            'font-medium rounded-full p-2 pl-4 pr-4 cursor-pointer',
            selectedList == 'followers'
              ? 'underline font-bold text-md text-white bg-green-500'
              : 'text-sm',
          )}
          onClick={() => setSelectedList('followers')}
        >
          Подписчики
        </strong>
        <strong
          className={classNames(
            'font-medium rounded-full p-2 pl-4 pr-4 cursor-pointer',
            selectedList == 'following'
              ? 'underline font-bold text-md text-white bg-green-500'
              : 'text-sm',
          )}
          onClick={() => setSelectedList('following')}
        >
          Подписки
        </strong>
      </div>
      <div className={selectedList == 'friends' ? 'block' : 'hidden'}>
        <GetFriends userId={userId} selectedList={selectedList} />
      </div>
      <div className={selectedList == 'followers' ? 'block' : 'hidden'}>
        <GetFollowers userId={userId} selectedList={selectedList} />
      </div>
      <div className={selectedList == 'following' ? 'block' : 'hidden'}>
        <GetFollowing userId={userId} selectedList={selectedList} />
      </div>
    </div>
  );

  return (
    <>
      <div>
        <MainHeader header={header} />
        {desktop}
        {mobile}
      </div>
    </>
  );
};
