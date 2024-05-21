import classNames from 'classnames';
import { useEffect, useState } from 'react';

import { IPublicUser } from '@/entities/User';
import { useAuth } from '@/features';
import {
  followToUserHandler,
  removeUserFromFollowersHandler,
  unFollowFromUserHandler,
} from '@/features/Relations/api/follower';
import { removeUserFromFriendsHandler } from '@/features/Relations/api/friend';
import CheckMark from '@/shared/assets/icons/CheckMark';
import CloseIcon from '@/shared/assets/icons/CloseIcon';
import { useLogin } from '@/shared/hooks';
import { useFollowRelationContext } from '@/shared/hooks/';
import { useAppSelector } from '@/shared/store/hooks';
import { userSelector } from '@/shared/store/selectors/user';
import { getId } from '@/shared/utils';
import styles from '@/widgets/RelationButtons/ui/RelationButtons.module.scss';

interface RelationButtonsProps {
  user: IPublicUser;
  fontSize?: 14 | 16 | 18;
}

const RelationButtons = ({ user, fontSize = 16 }: RelationButtonsProps) => {
  const [globalFollowRelations, setGlobalFollowRelations] = useFollowRelationContext();
  const [isFollower, setIsFollower] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const { setIsPopupLoginFormOpen } = useLogin();
  const { isLogged, executeQueryCallback } = useAuth();
  const [textSize, setTextSize] = useState('text-base');

  const [openFriendDropdown, setOpenFriendDropdown] = useState(false);
  const [openFollowerDropdown, setOpenFollowerDropdown] = useState(false);
  const [openFollowingDropdown, setOpenFollowingDropdown] = useState(false);
  const userInfo = useAppSelector(userSelector);

  useEffect(() => {
    const size = classNames(
      fontSize === 14 && 'text-sm',
      fontSize === 16 && 'text-base',
      fontSize === 18 && 'text-lg',
    );
    setTextSize(size);
  }, [fontSize]);

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

  const removeFriend = () => {
    if (!isLogged) {
      setIsPopupLoginFormOpen(true);
      return;
    }
    executeQueryCallback(async (accessToken: string) => {
      await removeUserFromFriendsHandler(getId(user), accessToken);
      setGlobalFollowRelations((state) => ({
        ...state,
        [getId(user).toString()]: {
          isFollower: true,
          isFollowing: false,
          isFriend: false,
        },
      }));
    });
  };

  const unFollow = () => {
    if (!isLogged) {
      setIsPopupLoginFormOpen(true);
      return;
    }
    executeQueryCallback(async (accessToken: string) => {
      await unFollowFromUserHandler(getId(user), accessToken);
      setGlobalFollowRelations((state) => ({
        ...state,
        [getId(user).toString()]: {
          isFollower: false,
          isFollowing: false,
          isFriend: false,
        },
      }));
    });
  };

  const removeFollower = () => {
    if (!isLogged) {
      setIsPopupLoginFormOpen(true);
      return;
    }
    executeQueryCallback(async (accessToken: string) => {
      await removeUserFromFollowersHandler(getId(user), accessToken);
      setGlobalFollowRelations((state) => ({
        ...state,
        [getId(user).toString()]: {
          isFollower: false,
          isFollowing: false,
          isFriend: false,
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
    <div className="flex items-start select-none">
      {user.reference == userInfo?.reference ? (
        // eslint-disable-next-line react/no-unescaped-entities
        <span className={styles.rainbowAnimated}>Это я</span>
      ) : isFollower ? (
        <span className={classNames('grid items-center gap-1', textSize)}>
          <div className="flex gap-3">
            <span
              className="text-[#4378FF] hover:bg-blue-100 p-2 cursor-pointer rounded transition-all ease-linear"
              onClick={() => setOpenFollowerDropdown((prev) => !prev)}
            >
              Подписан на Вас
            </span>
            <button
              className={classNames(
                'pr-2 pl-2 bg-[#4378FF] text-white rounded-full transition ease-linear hover:bg-purple-600',
                fontSize,
              )}
              onClick={() => followToFollower()}
            >
              Подписаться
            </button>
          </div>

          <button
            className={classNames(
              'transition ease-linear hover:bg-red-100 rounded flex p-2',
              openFollowerDropdown ? 'flex' : 'hidden',
            )}
            onClick={() => removeFollower()}
          >
            <span className="text-red-500 font-semibold">Удалить подписчика</span>
            <CloseIcon fill="red" />
          </button>
        </span>
      ) : isFollowing ? (
        <span className={classNames('grid items-center gap-1', fontSize)}>
          <span
            className="text-purple-600 hover:bg-purple-100 rounded cursor-pointer p-2 transition-all ease-linear text-center"
            onClick={() => setOpenFollowingDropdown((prev) => !prev)}
          >
            Подписки
          </span>
          <button
            className={classNames(
              'transition ease-linear hover:bg-red-100 rounded flex p-2',
              openFollowingDropdown ? 'flex' : 'hidden',
            )}
            onClick={() => unFollow()}
          >
            <span className="text-red-500 font-semibold flex">Отписаться</span>
            <CloseIcon fill="red" />
          </button>
        </span>
      ) : isFriend ? (
        <span className={classNames('grid items-center', fontSize)}>
          <div
            className="flex items-center gap-1 justify-center hover:bg-green-100 cursor-pointer rounded p-2 transition-all ease-linear"
            onClick={() => setOpenFriendDropdown((prev) => !prev)}
          >
            <span className="text-[#00a457]">Друзья</span>
            <CheckMark fill="#00a457" />
          </div>
          <button
            className={classNames(
              'transition ease-linear hover:bg-red-100 rounded p-2',
              openFriendDropdown ? 'flex' : 'hidden',
            )}
            onClick={() => removeFriend()}
          >
            <span className="text-red-500 font-semibold">Удалить из друзей</span>
            <CloseIcon fill="red" />
          </button>
        </span>
      ) : (
        <button
          className={classNames(
            'pr-2 pl-2 bg-[#4378FF] text-white rounded-full transition ease-linear hover:bg-purple-600 p-2',
            fontSize,
          )}
          onClick={() => followToUser()}
        >
          Подписаться
        </button>
      )}
    </div>
  );
};
export default RelationButtons;
