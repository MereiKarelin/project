import 'moment/locale/ru';

import moment from 'moment/moment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { INotification } from '@/entities/Notification/types';
import { IPublicUser } from '@/entities/User';
import { useAuth } from '@/features';
import { getUserByReference } from '@/shared/api/user';
import { defaultUserAvatar } from '@/shared/consts';

interface IProps {
  notification: INotification;
}

export const NewReactionNotificationCard = ({ notification }: IProps) => {
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

  if (!senderInfo) {
    return null;
  }

  return (
    <div className="grid gap-3 items-center cursor-pointer w-full p-2">
      <div className="flex gap-3">
        <img
          src={senderInfo?.avatar?.small_url || defaultUserAvatar}
          className="w-8 h-8 rounded-full"
        ></img>
        <div className="grid">
          <div className="flex gap-3">
            <strong className="text-sm overflow-ellipsis whitespace-nowrap overflow-hidden">
              {senderInfo?.fullname || '@' + senderInfo?.username}
            </strong>
          </div>
          <span style={{ wordBreak: 'break-word' }} className="text-sm">
            Отметился на реакции!
          </span>
          <div className="text-sm text-gray-500">
            {moment(notification?.created_at)
              .locale('ru')
              .fromNow()}
          </div>
        </div>
      </div>
      <div className="grid justify-center">
        <img
          src={notification.body?.reaction_structure?.icon_url}
          className="h-10 w-10 object-cover rounded-lg"
        />
        <span className="text-sm">{notification.body?.reaction_structure?.name}</span>
      </div>
    </div>
  );
};
