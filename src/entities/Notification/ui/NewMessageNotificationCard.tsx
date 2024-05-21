import 'moment/locale/ru';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { IDirectChat } from '@/entities/DirectChat/types';
import { INotification } from '@/entities/Notification/types';
import RelationInfo from '@/entities/Relations/ui/RelationInfo';
import { IPublicUser } from '@/entities/User';
import { useAuth } from '@/features';
import {
  createDirectChatHandler,
  getDirectChatBetweenUsersHandler,
} from '@/features/DirectChats/api/directChatsApi';
import { getUserByReference } from '@/shared/api/user';
import { defaultUserAvatar } from '@/shared/consts';
import moment from 'moment';

interface IProps {
  notification: INotification;
}

export const NewMessageNotificationCard = ({ notification }: IProps) => {
  const router = useRouter();
  const [senderInfo, setSenderInfo] = useState<IPublicUser | null>(null);

  useEffect(() => {
    executeQueryCallback((accessToken: string) => {
      void getUserByReference(notification.body?.user_reference, accessToken).then((res) => {
        setSenderInfo(res);
      });
    });
  }, []);

  const { executeQueryCallback } = useAuth();

  const createDirectChat = () => {
    if (!senderInfo) return;
    executeQueryCallback((accessToken: string) => {
      void createDirectChatHandler(senderInfo?.reference, accessToken)
        .then((responseChat: IDirectChat) => {
          router.push('/direct?reference=' + responseChat.reference, { scroll: false });
        })
        .catch((error) => {
          void getDirectChatBetweenUsersHandler(senderInfo?.reference, accessToken).then(
            (responseChat: IDirectChat) => {
              router.push('/direct?reference=' + responseChat.reference, { scroll: false });
            },
          );
          console.error(`createDirectChatHandler failed: ${error}`);
        });
    });
  };

  if (!senderInfo) {
    return null;
  }

  return (
    <div
      className="flex gap-3 items-center cursor-pointer p-2"
      onClick={() => {
        createDirectChat();
      }}
    >
      <img
        src={senderInfo?.avatar?.small_url || defaultUserAvatar}
        className="w-8 h-8 rounded-full"
      ></img>
      <div>
        <div className="flex gap-2">
          <strong className="text-sm overflow-ellipsis whitespace-nowrap overflow-hidden w-fit">
            {senderInfo?.fullname || '@' + senderInfo?.username}
          </strong>
          <RelationInfo user={senderInfo} />
        </div>
        <div className="flex gap-3">
          <span className="text-sm">Новое сообщение!</span>
          <div className="text-sm text-gray-500">
            {moment(notification?.created_at)
              .locale('ru')
              .fromNow()}
          </div>
        </div>
        <span style={{ wordBreak: 'break-word' }} className="font-semibold">
          {notification.body?.text}
        </span>
      </div>
    </div>
  );
};
