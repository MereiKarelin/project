import classNames from 'classnames';
import moment from 'moment';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

import { IReply } from '@/entities/Post/model/types';
import { ClassicPostMediaBody } from '@/entities/Post/ui/ClassicPostMediaBody';
import { CommentReply } from '@/entities/Post/ui/CommentReply';
import { PostMenu } from '@/entities/Post/ui/PostMenu';
import PostReactions from '@/entities/Post/ui/PostReactions';
import { ChildReply } from '@/entities/Post/ui/types';
import { useComments } from '@/entities/Post/utils/hooks';
import RelationInfo from '@/entities/Relations/ui/RelationInfo';
import { IPrivateUser } from '@/entities/User';
import { UserCard } from '@/entities/User/ui/UserCard';
import { useAuth } from '@/features/Auth/useAuth/useAuth';
import { deletePostHandler, getCommentRepliesHandler, viewPostHandler } from '@/shared/api/post';
import MenuDotsIcon from '@/shared/assets/icons/MenuDotsIcon';
import RepostIcon from '@/shared/assets/icons/RepostIcon';
import { useReactions } from '@/shared/hooks';
import { EllipsisSpinner } from '@/shared/ui/Spinners';
import { getId } from '@/shared/utils';

type PropTypes = {
  reply: IReply;
  openPopupImage: (image: string) => void;
  onReplyClick: (username: string) => void;
  childReply: ChildReply | undefined;
  setChildReply: Dispatch<SetStateAction<ChildReply | undefined>>;
  userInfo: IPrivateUser | null | undefined;
  handleDelete: () => void;
};

export const PostReply = ({
  reply,
  openPopupImage,
  onReplyClick,
  childReply,
  setChildReply,
  userInfo,
  handleDelete,
}: PropTypes) => {
  const { isLogged, executeQueryCallback } = useAuth();

  const setPostViewed = () => {
    if (isLogged) {
      executeQueryCallback((accessToken: string) => {
        void viewPostHandler(accessToken, reply.reference);
      });
    }
  };

  const [replies, setReplies] = useState<IReply[]>([] as IReply[]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { hasMoreComments, resetComments, isLoadingComments, loadMoreComments } = useComments(
    reply,
    setReplies,
    getCommentRepliesHandler,
    reply.total_replies,
  );

  const { reactions, setReactions, handleReactionClick } = useReactions(reply);

  useEffect(() => {
    if (!reply?.reactions.length) {
      setReactions(() => []);
      return;
    }
    //set default reaction
    setReactions(() => [reply?.reactions?.[0]]);
  }, [reply]);

  useEffect(() => {
    if (!childReply) return;
    if (childReply.parent !== reply) return;

    setReplies((prev) => [...prev, childReply.reply]);
    setChildReply(undefined);
  }, [childReply, reply, setChildReply]);

  const deleteComment = (reference: string) => {
    executeQueryCallback((accessToken: string) => {
      deletePostHandler(reference, accessToken)
        .then(() => {
          setReplies((posts) => [
            ...posts.filter((currentPost) => getId(currentPost) !== reference),
          ]);
        })
        .catch((error) => {
          alert('Can not delete post');
          console.error(
            `Comments fetch failed with exception: ${error?.response?.data?.exc_code ?? error}`,
          );

          if (error?.response?.data?.message) {
            console.error(error?.response?.data?.message);
          }
        });
    });
  };

  const hideComments = useCallback(() => {
    if (!replies.length) return;
    resetComments();
  }, [replies, resetComments]);

  return (
    <div
      className={classNames(
        reply.total_replies > 0 ? 'bg-[#E9FFEC] pt-2 rounded-t-2xl' : 'bg-gray-100 p-2',
        'w-full overflow-y-hidden',
      )}
    >
      <div
        className={classNames(
          reply.total_replies > 0 && 'pb-2',
          'px-2 flex flex-col items-start justify-start gap-3',
        )}
      >
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
        <div className="flex flex-row justify-between items-center w-full">
          <div
            className={classNames(
              'flex flex-row gap-3 items-center',
              reply.total_replies === 0 && 'invisible',
            )}
          >
            <hr className="w-5 h-[2px] bg-black/50" />
            <span
              className="text-[#717171] font-light text-sm cursor-pointer"
              onClick={() => (replies.length > 0 ? hideComments() : loadMoreComments())}
            >
              {replies.length > 0 ? 'скрыть' : 'посмотреть'}
              &nbsp;ответы
              {`(${replies.length > 0 ? replies.length : reply.total_replies})`}
            </span>
          </div>
          <div className="flex flex-row items-center justify-center gap-3">
            <PostReactions
              reactions={reactions}
              handleReactionClick={handleReactionClick}
              isNoPreview
              prefix="pp"
            />

            <div className="flex flex-row gap-1">
              <span className="cursor-pointer" onClick={() => onReplyClick(reply.user.username)}>
                <RepostIcon className="w-[24px] h-[24px]" />
              </span>
              <span className={classNames(reply.total_replies === 0 && 'invisible')}>
                {reply.total_replies}
              </span>
            </div>
          </div>
        </div>
      </div>
      {!!replies.length && (
        <>
          <div className="px-2 pb-2 bg-[#DDEFFF] w-full flex flex-col gap-3">
            {replies.map((reply) => (
              <CommentReply
                key={getId(reply)}
                reply={reply}
                openPopupImage={openPopupImage}
                isLogged={isLogged}
                onReplyClick={onReplyClick}
                userInfo={userInfo}
                handleDelete={() => {
                  deleteComment(reply.reference);
                }}
              />
            ))}
          </div>
          {hasMoreComments && (
            <div className="w-full flex flex-row items-center justify-center bg-[#DDEFFF] pb-2">
              <span
                className="text-[#0B6CFF] font-semibold text-sm cursor-pointer"
                onClick={loadMoreComments}
              >{`Загрузить еще (${reply.total_replies - replies.length})`}</span>
            </div>
          )}
          {isLoadingComments && (
            <div className="relative top-0 left-0 flex w-full h-auto items-center justify-center bg-[#DDEFFF]">
              <EllipsisSpinner />
            </div>
          )}
        </>
      )}
    </div>
  );
};
