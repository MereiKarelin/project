/* eslint-disable @next/next/no-img-element */
'use client';
import classNames from 'classnames';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { IDirectChat, IDirectChatUser } from '@/entities/DirectChat/types';
import { useAuth } from '@/features';
import { getDirectChatByReferenceHandler } from '@/features/DirectChats/api/directChatsApi';
import { GetDirectChats } from '@/features/DirectChats/GetDirectChats/GetDirectChats';
import { onWebsocketLeaveCommand } from '@/features/Notifications/api/websocketCommands';
import { useAppSelector } from '@/shared/store/hooks';
import { userSelector } from '@/shared/store/selectors/user';
import { lockBackground } from '@/shared/utils';
import MainHeader from '@/widgets/MainHeader/MainHeader';
import { SelectedChat } from '@/widgets/SelectedChat/SelectedChat';
import { SelectedChatUser } from '@/widgets/SelectedChat/SelectedChatUser';
import { IObject } from '@daybrush/utils';

type PropTypes = {
  header: IObject<string>;
};

const DirectChatPage = ({ header }: PropTypes) => {
  const [selectedChat, setSelectedChat] = useState<IDirectChat | null>(null);
  const [selectedChatUser, setSelectedChatUser] = useState<IDirectChatUser | null>(null);
  const [chatOpened, setChatOpened] = useState<boolean>(false);
  const [wss, setWss] = useState<WebSocket | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPopupImageOpen, setIsPopupImageOpen] = useState<boolean>(false);
  const [popupImageData, setPopupImageData] = useState<string>('');
  const { executeQueryCallback } = useAuth();
  const userInfo = useAppSelector(userSelector);

  useEffect(() => {
    executeQueryCallback((accessToken: string) => {
      const chatReference = searchParams.get('reference');
      if (chatReference) {
        void getDirectChatByReferenceHandler(chatReference, accessToken).then((res) => {
          selectChat(res);
          const nextSearchParams = new URLSearchParams(searchParams.toString());
          nextSearchParams.delete('reference');
          router.replace(`${pathname}?${nextSearchParams}`);
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    document.body.style.overflowY = 'hidden';
    return () => {
      closeChat();
    };
  }, []);

  const closeChat = () => {
    executeQueryCallback((accessToken: string) => {
      selectChat(null);
      if (wss?.readyState == 1) {
        wss.onclose = function () {}; // disable onclose handler first
        wss?.send(JSON.stringify(onWebsocketLeaveCommand(accessToken)));
        wss?.close();
      }
      setChatOpened(false);
      setWss(null);
    });
  };

  const selectChat = useCallback(
    (chat: IDirectChat | null) => {
      setSelectedChat(chat);

      if (selectedChat && userInfo) {
        if (selectedChat.first_user.reference === userInfo.reference) {
          setSelectedChatUser(selectedChat.second_user);
        } else {
          setSelectedChatUser(selectedChat.first_user);
        }
        setChatOpened(true);
      }
    },
    [userInfo, selectedChat],
  );

  const openPopupImage = (image: string) => {
    setIsPopupImageOpen(true);
    lockBackground(true);
    setPopupImageData(image);
  };

  const closePopupImage = () => {
    setIsPopupImageOpen(false);
    lockBackground(false);
    setPopupImageData('');
  };

  return (
    <>
      <div
        className={classNames(
          isPopupImageOpen ? 'flex' : 'hidden',
          'h-screen w-screen fixed top-0 flex-col items-center left-0 justify-center bg-black/50 z-50 p-10',
        )}
        onClick={(e) => {
          e.stopPropagation();
          closePopupImage();
        }}
      >
        <img
          src={popupImageData}
          alt="popupImage"
          className="flex flex-col w-full bg-white rounded-3xl overflow-hidden gap-5"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </div>
      <div className="h-[90svh]">
        <MainHeader header={header} />
        <div className="flex flex-row gap-3 h-full min-[960px]:mt-2 justify-center min-[960px]:px-3">
          <GetDirectChats
            selectChat={selectChat}
            selectedChat={selectedChat}
            chatOpened={chatOpened}
          />
          <SelectedChat
            chatOpened={chatOpened}
            closeChat={closeChat}
            openPopupImage={openPopupImage}
            selectedChat={selectedChat}
            selectedChatUser={selectedChatUser}
            wss={wss}
            setWss={setWss}
            userInfo={userInfo}
          />
          <SelectedChatUser
            selectedChat={selectedChat}
            selectedChatUser={selectedChatUser}
            userInfo={userInfo}
            isChatOpen={chatOpened}
          />
        </div>
      </div>
    </>
  );
};

export default DirectChatPage;
