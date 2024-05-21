import { Dispatch, Fragment, SetStateAction, useCallback, useEffect, useState } from 'react';

import { INotification } from '@/entities/Notification/types';
import { NewFollowerNotificationCard } from '@/entities/Notification/ui/NewFollowerNotificationCard';
import { NewFriendNotificationCard } from '@/entities/Notification/ui/NewFriendNotificationCard';
import { NewMessageNotificationCard } from '@/entities/Notification/ui/NewMessageNotificationCard';
import { NewPostNotificationCard } from '@/entities/Notification/ui/NewPostNotificationCard';
import { NewReactionNotificationCard } from '@/entities/Notification/ui/NewReactionNotificationCard';
import { NewReplyNotificationCard } from '@/entities/Notification/ui/NewReplyNotificationCard';
import { NewRepostNotificationCard } from '@/entities/Notification/ui/NewRepostNotificationCard';
import { useAuth } from '@/features';
import {
  getNotificationsHandler,
  readNotificationsAuth,
} from '@/features/Notifications/api/notificationsApi';
import { useNotification } from '@/features/Notifications/useNotifications/useNotifications';
import ReactIntersectionObserver from '@/shared/ui/ReactIntersectionObserver';

interface IProps {
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: Dispatch<SetStateAction<boolean>>;
}

export const GetNotifications = ({ isNotificationsOpen, setIsNotificationsOpen }: IProps) => {
  const [list, setList] = useState<INotification[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const { setTotalUnreadNotifications, unreadNotifications } = useNotification();
  const { executeQueryCallback } = useAuth();

  const loadNext = useCallback(() => {
    executeQueryCallback((accessToken: string) => {
      if (hasMore && !isLoading) {
        setIsLoading(true);

        const dateCursorId = new Date();
        const limit = 10;

        void getNotificationsHandler(offset, limit, dateCursorId, accessToken)
          .then((res) => {
            setList((prev) => [...prev, ...res.items]);
            setHasMore(res.items.length >= limit);
            setOffset((prev) => prev + limit);
          })
          .catch((error) => {
            console.error(
              `Direct chats fetch failed with exception: ${
                error?.response?.data?.exc_code ?? error
              }`,
            );

            if (error?.response?.data?.message) {
              console.error(error?.response?.data?.message);
            }
            setHasMore(false);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    });
  }, [hasMore, isLoading, offset]);

  useEffect(() => {
    if (!isNotificationsOpen) return;
    setList([]);
    setHasMore(true);
    setIsLoading(false);
    setOffset(0);
  }, [isNotificationsOpen]);

  useEffect(() => {
    if (isNotificationsOpen) {
      setList((prevList) => {
        // Map through existing notifications to update or keep them as is
        const updatedList = prevList.map((notification) => {
          // Find if there's an updated notification for this one
          const updatedNotification = unreadNotifications.find(
            (unreadNotification) =>
              unreadNotification.body.chat_reference === notification.body.chat_reference,
          );

          // If an updated notification exists, return it, otherwise return the original
          return updatedNotification ?? notification;
        });

        return updatedList;
      });
    }
  }, [unreadNotifications]);

  const readNotificationsHandler = () => {
    executeQueryCallback((accessToken: string) => {
      void readNotificationsAuth(accessToken).then(() => {
        setTotalUnreadNotifications(0);
        setIsNotificationsOpen(false);
      });
    });
  };

  return (
    <>
      <div
        onClick={readNotificationsHandler}
        className="bg-blue-500 text-white p-2 rounded cursor-pointer"
      >
        Прочитать уведомления
      </div>
      <br />
      <ReactIntersectionObserver hasMore={hasMore} isLoading={isLoading} loadNext={loadNext}>
        {list.length ? (
          list.map((notification: INotification) => (
            <Fragment key={notification.reference}>
              {notification.type == 'NEW_MESSAGE' ? (
                <NewMessageNotificationCard notification={notification} />
              ) : notification.type == 'NEW_FOLLOWER' ? (
                <NewFollowerNotificationCard notification={notification} />
              ) : notification.type == 'NEW_REPLY' ? (
                <NewReplyNotificationCard notification={notification} />
              ) : notification.type == 'NEW_FRIEND' ? (
                <NewFriendNotificationCard notification={notification} />
              ) : notification.type == 'NEW_REPOST' ? (
                <NewRepostNotificationCard notification={notification} />
              ) : notification.type == 'NEW_REACTION' ? (
                <NewReactionNotificationCard notification={notification} />
              ) : notification.type == 'NEW_POST' ? (
                <NewPostNotificationCard notification={notification} />
              ) : null}
              <hr />
            </Fragment>
          ))
        ) : (
          <span className="self-center text-center">У вас нет уведомлений</span>
        )}
      </ReactIntersectionObserver>
    </>
  );
};
