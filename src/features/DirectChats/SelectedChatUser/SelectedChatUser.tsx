/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

import { IDirectChatUser } from '@/entities/DirectChat/types';
import { IPrivateUser } from '@/entities/User';
import { defaultUserAvatar } from '@/shared/consts';

type PropTypes = {
  selectedChatUser: IDirectChatUser | null;
  closeChat: () => void;
  userInfo: IPrivateUser | null | undefined;
  isTargetUserInChat: boolean;
};

export const SelectedChatUser = ({
  selectedChatUser,
  closeChat,
  userInfo,
  isTargetUserInChat,
}: PropTypes) => {
  if (!selectedChatUser) return null;

  return (
    <div className="flex flex-row gap-3 p-2 min-w-[960px]:p-4 border-b border-b-gray-200 h-[93px]  justify-center items-center">
      <div className="grid grid-cols-[80px_1fr] max-[450px]:grid-cols-[80px_1fr] w-full gap-3">
        <div
          onClick={() => closeChat()}
          className="cursor-pointer p-2 bg-blue-500 text-white rounded-full h-fit self-center text-center"
        >
          Назад
        </div>
        <Link
          href={`id/${selectedChatUser.username}`}
          className="w-full flex overflow-ellipsis whitespace-nowrap overflow-hidden gap-3 items-center"
        >
          <img
            className="w-[60px] h-[60px] rounded-full max-[450px]:w-[45px] max-[450px]:h-[45px] self-center"
            src={
              selectedChatUser.reference != userInfo?.reference
                ? selectedChatUser.avatar_url || defaultUserAvatar
                : defaultUserAvatar
            }
            alt="avatar"
          />
          <div className="overflow-ellipsis whitespace-nowrap overflow-hidden w-full">
            {selectedChatUser.reference == userInfo?.reference ? (
              <>Избранные сообщения</>
            ) : (
              <>
                {selectedChatUser.fullname}
                <br />@{selectedChatUser.username}
              </>
            )}
          </div>
        </Link>
      </div>
      <span className="font-black text-green-500 flex justify-center items-center">
        {isTargetUserInChat && 'В чате'}
      </span>
    </div>
  );
};
