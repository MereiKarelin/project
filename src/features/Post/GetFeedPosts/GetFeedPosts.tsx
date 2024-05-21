'use client';

import { PostList } from '@/features/Post/ui/PostList';
import { getPostsAuth } from '@/shared/api/post';

export const FeedPosts = () => {
  return <PostList getPostsHandler={getPostsAuth} isMe={true} />;
};
