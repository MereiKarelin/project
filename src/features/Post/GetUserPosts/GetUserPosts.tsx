'use client';
import { useCallback } from 'react';

import { PostList } from '@/features/Post/ui/PostList';
import { getUserPostsHandler } from '@/shared/api/post';
import { useAppSelector } from '@/shared/store/hooks';
import { userSelector } from '@/shared/store/selectors/user';

interface IProps {
  userId: number | string;
}

export const GetUserPosts = ({ userId }: IProps) => {
  const userInfo = useAppSelector(userSelector);

  const getPostsHandler = useCallback(
    (
      offset: number | undefined,
      limit: number | undefined,
      dateCursorId: Date,
      accessToken: string,
    ) => getUserPostsHandler(userId, dateCursorId, offset, limit, accessToken),
    [userId],
  );

  return <PostList getPostsHandler={getPostsHandler} isMe={userInfo?.reference === userId} />;
};
