import classNames from 'classnames';
import { useEffect, useState } from 'react';

import { IPublicUser } from '@/entities/User';
import { useAuth } from '@/features';
import { followToUserHandler } from '@/features/Relations/api/follower';
import CheckMark from '@/shared/assets/icons/CheckMark';
import { useFollowRelationContext, useLogin } from '@/shared/hooks';
import { useAppSelector } from '@/shared/store/hooks';
import { userSelector } from '@/shared/store/selectors/user';
import { getId } from '@/shared/utils';
import styles from '@/widgets/RelationButtons/ui/RelationButtons.module.scss';

interface RelationButtonsProps {
  user: IPublicUser;
}

const RelationInfo = ({ user }: RelationButtonsProps) => {
  const [globalFollowRelations, setGlobalFollowRelations] = useFollowRelationContext();
  const [isFollower, setIsFollower] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const { setIsPopupLoginFormOpen } = useLogin();
  const { isLogged, executeQueryCallback } = useAuth();
  const userInfo = useAppSelector(userSelector);

  const followToUser = () => {
    if (!isLogged) {
      setIsPopupLoginFormOpen(true);
      return;
    }
    executeQueryCallback(async (accessToken: string) => {
      await followToUserHandler(getId(user), accessToken);
      setGlobalFollowRelations((state) => ({
        ...state,
        [getId(user).toString()]: {
          isFollower,
          isFollowing: true,
          isFriend,
        },
      }));
    });
  };

  const followToFollower = () => {
    if (!isLogged) {
      setIsPopupLoginFormOpen(true);
      return;
    }
    executeQueryCallback(async (accessToken: string) => {
      await followToUserHandler(getId(user), accessToken);
      setGlobalFollowRelations((state) => ({
        ...state,
        [getId(user).toString()]: {
          isFollower: false,
          isFollowing: false,
          isFriend: true,
        },
      }));
    });
  };

  useEffect(() => {
    if (user?.status?.status?.includes('follower')) {
      setIsFollower(true);
    } else if (user?.status?.status?.includes('friend')) {
      setIsFriend(true);
    } else if (user?.status?.status?.includes('following')) {
      setIsFollowing(true);
    }
    if (!isLogged) {
      setIsFollower(false);
      setIsFriend(false);
      setIsFollowing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.status?.status, isLogged]);

  useEffect(() => {
    const globalStatus = globalFollowRelations[getId(user).toString()];

    if (!globalStatus) return;

    setIsFollower(globalStatus.isFollower);
    setIsFriend(globalStatus.isFriend);
    setIsFollowing(globalStatus.isFollowing);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFollowRelations]);

  return (
    <div className="flex items-start">
      {user.reference == userInfo?.reference ? (
        // eslint-disable-next-line react/no-unescaped-entities
        <span className={styles.rainbowAnimated}>Это я</span>
      ) : isFollower ? (
        <span className={classNames('flex text-[#4378FF] items-center gap-1 text-sm')}>
          <button
            className={classNames(
              'pr-2 pl-2 bg-[#4378FF] text-white rounded-full transition ease-linear hover:bg-purple-600 text-sm',
            )}
            onClick={() => followToFollower()}
          >
            Подписаться в ответ
          </button>
        </span>
      ) : isFollowing ? (
        <span className={classNames('flex text-purple-600 items-center gap-1 text-sm')}>
          Подписки
        </span>
      ) : isFriend ? (
        <span className={classNames('flex text-[#00a457] items-center gap-1 text-sm')}>
          Друзья
          <CheckMark fill="#00a457" />
        </span>
      ) : (
        <button
          className={classNames(
            'pr-2 pl-2 bg-[#4378FF] text-white rounded-full transition ease-linear hover:bg-purple-600 text-sm',
          )}
          onClick={() => followToUser()}
        >
          Подписаться
        </button>
      )}
    </div>
  );
};
export default RelationInfo;
