import { Dispatch, SetStateAction, useCallback, useState } from 'react';

import { IPost, IReply } from '@/entities/Post/model/types';
import { useAuth } from '@/features';
import { logBackendError } from '@/shared/utils/error';

type GetCommentsHandler = (
  postId: string | number,
  dateCursorId: Date,
  offset?: number,
  limit?: number,
  accessToken?: string,
) => Promise<any>;

type SetReplies = Dispatch<SetStateAction<IReply[]>>;

export const useComments = (
  post: IPost,
  setReplies: SetReplies,
  getCommentsHandler: GetCommentsHandler,
  totalCount = 10,
) => {
  const [hasMoreComments, setHasMoreComments] = useState(totalCount > 0);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [offsetComments, setOffsetComments] = useState(0);
  const { executeQueryCallback } = useAuth();

  const resetComments = useCallback(() => {
    setHasMoreComments(true);
    setOffsetComments(0);
    setReplies([]);
  }, [setReplies]);

  const loadMoreComments = useCallback(() => {
    if (!post || !hasMoreComments || isLoadingComments) return;

    executeQueryCallback((accessToken: string) => {
      setIsLoadingComments(true);

      const dateCursorId = new Date();
      const limit = 10;

      getCommentsHandler(post.reference, dateCursorId, offsetComments, limit, accessToken)
        .then((response) => {
          setReplies((prev) => [...prev, ...response.items.map((reply: IReply) => ({ ...reply }))]);
          setHasMoreComments(response.items.length >= limit);
          setIsLoadingComments(false);
          setOffsetComments((prev) => prev + limit);
        })
        .catch((error) => {
          logBackendError(error, 'Comments fetch failed with exception');
          setHasMoreComments(false);
        })
        .finally(() => {
          setIsLoadingComments(false);
        });
    });
  }, [
    getCommentsHandler,
    hasMoreComments,
    isLoadingComments,
    offsetComments,
    post,
    setReplies,
    executeQueryCallback,
  ]);

  return { hasMoreComments, isLoadingComments, loadMoreComments, resetComments };
};
