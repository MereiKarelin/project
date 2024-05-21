import classNames from 'classnames';
import { ReactNode, useEffect, useState } from 'react';

import { IDirectChat, IDirectChatUser } from '@/entities/DirectChat/types';
import { IPrivateUser } from '@/entities/User';
import { GetDirectMessages } from '@/features/DirectChats/GetDirectMessages/GetDirectMessages';
import { SelectedChatUser } from '@/features/DirectChats/SelectedChatUser/SelectedChatUser';
import { consoleLog } from '@/shared/utils';

type PropTypes = {
  selectedChat: IDirectChat | null;
  wss: WebSocket | null;
  setWss: (wss: WebSocket | null) => void;
  openPopupImage: (image: string) => void;
  selectedChatUser: IDirectChatUser | null;
  closeChat: () => void;
  userInfo: IPrivateUser | null | undefined;
  chatOpened: boolean;
};

const StyleWrapper = ({ children, chatOpened }: { children: ReactNode; chatOpened: boolean }) => {
  return (
    <div
      className={classNames(
        'bg-white drop-shadow min-[960px]:rounded-[20px] shrink-0 w-full min-[514px]:w-[514px]',
        chatOpened ? 'max-[960px]:grid' : 'max-[960px]:hidden',
      )}
    >
      {children}
    </div>
  );
};

export const SelectedChat = ({
  selectedChat,
  wss,
  setWss,
  openPopupImage,
  selectedChatUser,
  closeChat,
  userInfo,
  chatOpened,
}: PropTypes) => {
  const [isTargetUserInChat, setIsTargetUserInChat] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedChat || !userInfo) return;

    if (selectedChat.first_user.reference === userInfo.reference) {
      setIsTargetUserInChat(selectedChat.second_user.is_online_in_chat);
      consoleLog('isOnline3: ' + selectedChat.second_user.is_online_in_chat);
      return;
    }

    consoleLog('isOnline4: ' + selectedChat.first_user.is_online_in_chat);
    setIsTargetUserInChat(selectedChat.first_user.is_online_in_chat);
  }, [selectedChat, userInfo]);

  if (!selectedChat) {
    return (
      <StyleWrapper chatOpened={chatOpened}>
        <div className="p-2">
          <h1 className="text-2xl text-center">Выберите чат</h1>
        </div>
      </StyleWrapper>
    );
  }

  if (isTargetUserInChat) {
    consoleLog('isTargetUserInChat true');
  }

  return (
    <StyleWrapper chatOpened={chatOpened}>
      <SelectedChatUser
        closeChat={closeChat}
        isTargetUserInChat={isTargetUserInChat}
        selectedChatUser={selectedChatUser}
        userInfo={userInfo}
      />
      <GetDirectMessages
        selectedChat={selectedChat}
        wss={wss}
        setWss={setWss}
        setIsTargetUserInChat={setIsTargetUserInChat}
        openPopupImage={openPopupImage}
      />
    </StyleWrapper>
  );
};
