import { useEffect, useState } from 'react';

import { IProfile } from '@/entities/Profile';
import { PostList } from '@/features/Post/ui/PostList';
import { getTrendingPostsHandler } from '@/shared/api/post';
import { useAppSelector } from '@/shared/store/hooks';
import { userSelector } from '@/shared/store/selectors/user';
import { getCurrentProfile } from '@/shared/utils';
import { getAge } from '@/shared/utils/date';

export const GetTrendingPosts = () => {
  const userInfo = useAppSelector(userSelector);
  const [userProfile, setUserProfile] = useState<IProfile | null>(null);
  useEffect(() => {
    const userProfileInfo = getCurrentProfile();

    setUserProfile(userProfileInfo);
  }, []);

  return (
    <>
      {userProfile?.is_closed && getAge(userInfo?.birth_date) > 18 ? (
        <p className="w-full bg-red-200 flex justify-center text-red-400">
          Ваш профиль закрыт. Откройте свой профиль, чтобы пользователи увидели ваши посты.
        </p>
      ) : null}
      <PostList getPostsHandler={getTrendingPostsHandler} isMe={true} />
    </>
  );
};
