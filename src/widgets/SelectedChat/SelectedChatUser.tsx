import classNames from 'classnames';
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { ReactNode } from 'react';

import { IDirectChat, IDirectChatUser } from '@/entities/DirectChat/types';
import { IPrivateUser } from '@/entities/User';
import { defaultUserAvatar } from '@/shared/consts';

type PropTypes = {
  selectedChat: IDirectChat | null;
  selectedChatUser: IDirectChatUser | null;
  userInfo: IPrivateUser | null | undefined;
  isChatOpen: boolean;
};

const StyleWrapper = ({ children, isChatOpen }: { children: ReactNode; isChatOpen: boolean }) => {
  return (
    <div
      className={classNames(
        'bg-white drop-shadow w-[320px] max-[1200px]:hidden rounded-[20px] p-2 shrink-0',
        !isChatOpen && 'hidden',
      )}
    >
      {children}
    </div>
  );
};

export const SelectedChatUser = ({
  selectedChat,
  selectedChatUser,
  userInfo,
  isChatOpen,
}: PropTypes) => {
  if (!selectedChat) {
    <StyleWrapper isChatOpen={isChatOpen}>
      <div className="p-2">
        <h1 className="text-2xl text-center">Выберите чат</h1>
      </div>
    </StyleWrapper>;
  }

  if (!selectedChatUser) {
    return null;
  }

  return (
    <StyleWrapper isChatOpen={isChatOpen}>
      <div className="grid gap-3">
        <img
          className="w-full h-auto self-center rounded-3xl"
          src={
            selectedChatUser.reference != userInfo?.reference
              ? selectedChatUser.avatar_url || defaultUserAvatar
              : defaultUserAvatar
          }
          alt="avatar"
        />
        <div className="overflow-ellipsis whitespace-nowrap overflow-hidden w-full justify-center grid gap-3">
          {selectedChatUser.reference == userInfo?.reference ? (
            <>Избранные сообщения</>
          ) : (
            <>
              <span className="text-xl font-bold text-center">{selectedChatUser.fullname}</span>
              <span className="text-md font-bold text-center">@{selectedChatUser.username}</span>
            </>
          )}
        </div>
        <Link
          href={`id/${selectedChatUser.username}`}
          className="p-2 rounded-3xl bg-blue-500 text-white text-center"
        >
          Посмотреть профиль
        </Link>
      </div>
    </StyleWrapper>
  );
};
