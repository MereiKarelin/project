import moment from 'moment';
import { useState } from 'react';

import { IReply } from '@/entities/Post/model/types';
import { PostReactions } from '@/entities/Post/ui';
import { ClassicPostMediaBody } from '@/entities/Post/ui/ClassicPostMediaBody';
import { PostMenu } from '@/entities/Post/ui/PostMenu';
import RelationInfo from '@/entities/Relations/ui/RelationInfo';
import { IPrivateUser } from '@/entities/User';
import { UserCard } from '@/entities/User/ui/UserCard';
import { useAuth } from '@/features';
import { viewPostHandler } from '@/shared/api/post';
import MenuDotsIcon from '@/shared/assets/icons/MenuDotsIcon';
import RepostIcon from '@/shared/assets/icons/RepostIcon';
import { useReactions } from '@/shared/hooks';

type PropTypes = {
  reply: IReply;
  openPopupImage: (image: string) => void;
  isLogged: boolean;
  onReplyClick: (username: string) => void;
  userInfo: IPrivateUser | null | undefined;
  handleDelete: () => void;
};

export const CommentReply = ({
  reply,
  openPopupImage,
  isLogged,
  onReplyClick,
  userInfo,
  handleDelete,
}: PropTypes) => {
  const { executeQueryCallback } = useAuth();
  const setPostViewed = () => {
    if (isLogged) {
      executeQueryCallback((accessToken: string) => {
        void viewPostHandler(accessToken, reply.reference);
      });
    }
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { reactions, handleReactionClick } = useReactions(reply);

  return (
    <>
      <div className="w-full flex flex-col items-start justify-start gap-3">
        <div className="w-full flex flex-row justify-between">
          <div className="flex flex-col md:flex-row gap-3">
            {!reply?.user ? null : (
              <UserCard
                user={reply.user}
                className="rounded flex gap-3"
                fontSize={14}
                truncateNames
              />
            )}
            <div className="flex text-sm items-center gap-3 p-2">
              <span className="flex flex-col text-[#707579] text-sm">
                {moment(reply.created_at).locale('ru').fromNow()}
              </span>
              <span className="text-[#707579] text-sm">•</span>
              <span className="text-sm">
                <RelationInfo user={reply.user} />
              </span>
            </div>
          </div>

          <PostMenu
            deleteComment={() => {
              handleDelete();
              setIsMenuOpen(false);
            }}
            postUser={reply.user}
            userInfo={userInfo}
            menuIcon={<MenuDotsIcon />}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        </div>
        <p className="break-words w-full whitespace-pre-wrap">{reply.body.text}</p>
        {reply.body.video_url || reply.body.image_url ? (
          <ClassicPostMediaBody
            post={reply}
            setPostViewed={setPostViewed}
            openPopupImage={openPopupImage}
          />
        ) : null}
        <div className="flex flex-row justify-end items-center w-full">
          <div className="flex flex-row items-center justify-center gap-3">
            <PostReactions
              reactions={reactions}
              handleReactionClick={handleReactionClick}
              isNoPreview
              prefix="pp"
            />
            <span className="cursor-pointer" onClick={() => onReplyClick(reply.user.username)}>
              <RepostIcon className="w-[24px] h-[24px]" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
