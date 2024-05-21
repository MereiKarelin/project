'use client';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { IPublicUser } from '@/entities/User';
import { defaultUserAvatar } from '@/shared/consts';

type PropTypes = {
  user: IPublicUser;
  className?: string;
  fontSize?: 14 | 16 | 18;
  truncateNames?: boolean;
};

export const UserCard = ({
  user,
  className = 'rounded p-[5px] bg-white flex gap-3 justify-between',
  fontSize = 16,
  truncateNames = false,
}: PropTypes) => {
  const [textSize, setTextSize] = useState('text-base');

  useEffect(() => {
    const size = classNames(
      fontSize === 14 && 'text-sm',
      fontSize === 16 && 'text-base',
      fontSize === 18 && 'text-lg',
    );
    setTextSize(size);
  }, [fontSize]);

  return (
    <>
      <div
        className={className}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Link href={`/id/${user.username}`}>
          <div className="grid grid-cols-[40px_1fr] gap-3">
            <Image
              src={user?.avatar ? user.avatar.small_url : defaultUserAvatar}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="w-10 h-10 rounded-full overflow-hidden"
            />
            <div
              className={classNames(
                'grid items-start',
                user?.fullname && user.username ? 'justify-around' : 'pt-1 justify-start',
              )}
            >
              {user?.fullname && (
                <strong
                  className={classNames(
                    'overflow-ellipsis whitespace-nowrap overflow-hidden w-full text-sm',
                    truncateNames && 'w-16 truncate',
                    textSize,
                  )}
                >
                  {user?.fullname}
                </strong>
              )}
              {user.username && (
                <div
                  className={classNames(
                    'overflow-ellipsis whitespace-nowrap overflow-hidden w-full text-sm',
                    truncateNames && 'w-16 truncate',
                    'font-light',
                    textSize,
                  )}
                >
                  @{user.username}
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};
