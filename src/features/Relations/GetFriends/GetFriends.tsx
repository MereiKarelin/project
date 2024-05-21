import { useCallback, useEffect, useState } from 'react';

import { IPublicUser } from '@/entities/User';
import { useAuth } from '@/features';
import { getFriendsHandler } from '@/features/Relations/api/friend';
import { RelationsList } from '@/features/Relations/ui/RelationsList';

interface IProps {
  userId: string;
  selectedList?: string;
}

export const GetFriends = ({ userId, selectedList }: IProps) => {
  const [list, setList] = useState<IPublicUser[]>([]);
  const [listCount, setListCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const { executeQueryCallback } = useAuth();

  const loadNext = useCallback(() => {
    if (hasMore && !isLoading) {
      setIsLoading(true);

      executeQueryCallback((accessToken: string) => {
        const dateCursorId = new Date();
        const limit = 10;

        void getFriendsHandler(userId, offset, limit, dateCursorId, accessToken)
          .then((res) => {
            setList((prev) => [...prev, ...res.items]);
            setListCount(res.total);
            setHasMore(res.items.length >= limit);
            setIsLoading(false);
            setOffset((prev) => prev + limit);
          })
          .catch((error) => {
            console.error(
              `Friends fetch failed with exception: ${error?.response?.data?.exc_code ?? error}`,
            );

            if (error?.response?.data?.message) {
              console.error(error?.response?.data?.message);
            }
            setHasMore(false);
          })
          .finally(() => {
            setIsLoading(false);
          });
      });
    }
  }, [hasMore, isLoading, offset, userId, executeQueryCallback]);

  useEffect(() => {
    if (selectedList) return;
    setList([]);
    setHasMore(true);
    setIsLoading(false);
    setOffset(0);
  }, [selectedList]);

  return (
    <RelationsList
      list={list}
      listCount={listCount}
      hasMore={hasMore}
      isLoading={isLoading}
      loadNext={loadNext}
      name="Друзья"
      alternativeContent="У вас пока нет друзей"
    />
  );
};
