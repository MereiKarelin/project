/* eslint-disable @next/next/no-img-element */
import classNames from 'classnames';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';

import { IDirectChat, IDirectChatUser, ILastMessage } from '@/entities/DirectChat/types';
import { useAuth } from '@/features';
import { readAllMessagesInDirectChatHandler } from '@/features/DirectChats/api/directChatsApi';
import { useNotification } from '@/features/Notifications/useNotifications/useNotifications';
import { defaultUserAvatar } from '@/shared/consts';
import { useAppSelector } from '@/shared/store/hooks';
import { userSelector } from '@/shared/store/selectors/user';

interface IProps {
  chat: IDirectChat;
  selectedChat: IDirectChat | null;
  selectChat: (chat: IDirectChat | null) => void;
}

export const DirectChatCard = ({ chat, selectedChat, selectChat }: IProps) => {
  const [lastMessage, setLastMessage] = useState<ILastMessage | null>(chat.last_message);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(
    chat.unread_messages_count,
  );
  const { unreadNotificationsFromChats, setTotalUnreadNotifications, setTotalUnreadNewMessages } =
    useNotification();

  const [processedNotifications, setProcessedNotifications] = useState<string[]>([]);
  const [targetUser, setTargetUser] = useState<IDirectChatUser | null>(null);
  const { executeQueryCallback } = useAuth();
  const userInfo = useAppSelector(userSelector);

  useEffect(() => {
    if (chat.first_user.reference == userInfo?.reference) {
      setTargetUser(chat.second_user);
    } else {
      setTargetUser(chat.first_user);
    }
  }, [chat, userInfo]);

  useEffect(() => {
    unreadNotificationsFromChats.forEach((notification) => {
      if (
        notification.body.chat_reference === chat.reference &&
        !processedNotifications.includes(notification.reference)
      ) {
        setLastMessage(notification?.body as ILastMessage);
        setUnreadMessagesCount((prev) => prev + 1);
        setProcessedNotifications((prev) => [...prev, notification.reference]);
      }
    });
  }, [unreadNotificationsFromChats, chat.reference, processedNotifications]);

  useEffect(() => {
    if (chat.unread_messages_count == 0) {
      setUnreadMessagesCount(0);
    }
  }, [chat.unread_messages_count]);

  const readMessages = useCallback(() => {
    setTimeout(() => {
      executeQueryCallback((accessToken: string) => {
        if (unreadMessagesCount > 0) {
          void readAllMessagesInDirectChatHandler(chat.reference, accessToken).then(() => {
            setTotalUnreadNotifications((prev) => (prev > 1 ? prev - 1 : 0));
            setTotalUnreadNewMessages((prev) =>
              prev - unreadMessagesCount > -1 ? prev - unreadMessagesCount : 0,
            );
            setUnreadMessagesCount(0);
          });
        }
      });
    }, 300);
  }, [
    chat.reference,
    setTotalUnreadNewMessages,
    setTotalUnreadNotifications,
    unreadMessagesCount,
    executeQueryCallback,
  ]);

  return (
    <div
      className={classNames(
        'p-2 items-center flex flex-row gap-3 cursor-pointer h-[76px] w-full',
        chat && chat === selectedChat && 'bg-[#98FFC1]',
      )}
      onClick={() => {
        selectChat(chat);
        readMessages();
      }}
    >
      <div className="relative w-[55px] h-[55px] shrink-0">
        <img
          src={
            targetUser?.reference != userInfo?.reference
              ? targetUser?.avatar_url || defaultUserAvatar
              : defaultUserAvatar
          }
          alt="avatar"
          className="w-[55px] h-[55px] rounded-full"
        />
        {targetUser?.reference != userInfo?.reference && (
          <span
            className={classNames(
              targetUser?.is_online_in_chat ? 'bg-green-500' : 'bg-gray-500',
              'w-5 h-5 rounded-full absolute top-[50%] left-[50%] border-white border-2',
            )}
          />
        )}
      </div>
      <div className="overflow-ellipsis whitespace-nowrap overflow-hidden w-full h-full flex flex-col gap-1 py-1 grow">
        <div className="flex justify-between">
          <>
            <span className="overflow-ellipsis whitespace-nowrap overflow-hidden w-full font-bold text-base">
              {targetUser?.reference == userInfo?.reference ? (
                <>Избранные сообщения</>
              ) : (
                <>{targetUser?.fullname || '@' + targetUser?.username}</>
              )}
            </span>
          </>

          <span>
            {moment(lastMessage?.created_at)
              .locale('ru')
              .format('HH:mm')}
          </span>
        </div>
        <div className="flex flex-row gap-1">
          <span className="flex flex-row gap-1 justify-start text-blue-500 font-bold text-base overflow-ellipsis whitespace-nowrap overflow-hidden">
            {lastMessage?.user_reference == userInfo?.reference && <span>Вы:</span>}
            <span>{lastMessage?.text}</span>
          </span>

          {unreadMessagesCount > 0 ? (
            <span className="text-white bg-red-500 h-6 rounded-full pr-2 pl-2">
              {unreadMessagesCount}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
