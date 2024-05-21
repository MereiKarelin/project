import classNames from 'classnames';
import { Dispatch, SetStateAction, useState } from 'react';

import { IClassicBody, IPost, IReply } from '@/entities/Post/model/types';
import { PostReply } from '@/entities/Post/ui//PostReply';
import { ChildReply } from '@/entities/Post/ui/types';
import { useAuth } from '@/features';
import { deletePostHandler } from '@/shared/api/post';
import { useAppSelector } from '@/shared/store/hooks';
import { userSelector } from '@/shared/store/selectors/user';
import ReactIntersectionObserver from '@/shared/ui/ReactIntersectionObserver';
import { getId, lockBackground } from '@/shared/utils';

type PropTypes = {
  replies: IReply[];
  setReplies: Dispatch<SetStateAction<IReply[]>>;
  hasMore: boolean;
  isLoading: boolean;
  setReplyInput: Dispatch<SetStateAction<IClassicBody>>;
  setReplyParent: Dispatch<SetStateAction<IPost | IReply>>;
  loadNext: () => void;
  childReply: ChildReply | undefined;
  setChildReply: Dispatch<SetStateAction<ChildReply | undefined>>;
};

const getReplyParent = (reply: IReply) => {
  return reply;
};

export const PostComments = ({
  replies,
  setReplies,
  hasMore,
  isLoading,
  loadNext,
  setReplyInput,
  setReplyParent,
  childReply,
  setChildReply,
}: PropTypes) => {
  const [popupImageData, setPopupImageData] = useState<string>('');
  const [isPopupImageOpen, setIsPopupImageOpen] = useState<boolean>(false);
  const { executeQueryCallback } = useAuth();
  const userInfo = useAppSelector(userSelector);

  const openPopupImage = (image: string) => {
    setIsPopupImageOpen(true);
    lockBackground(true);
    setPopupImageData(image);
  };

  const closePopupImage = () => {
    setIsPopupImageOpen(false);
    lockBackground(false);
    setPopupImageData('');
  };

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

  const popupImage = (
    <div
      className={classNames(
        isPopupImageOpen ? 'flex' : 'hidden',
        'h-screen w-screen fixed top-0 flex-col items-center left-0 justify-center bg-black/50 z-50 p-10',
      )}
      onClick={(e) => {
        e.stopPropagation();
        closePopupImage();
      }}
    >
      <img
        src={popupImageData}
        alt="popupImage"
        className="flex flex-col w-auto bg-white rounded-3xl overflow-hidden gap-5"
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    </div>
  );

  return (
    <>
      {popupImage}
      <span className="w-full text-start font-semibold pl-1">Комментарии</span>
      <div className="h-[300px] relative">
        {(!!replies?.length || hasMore) && (
          <div className="w-full px-1 flex flex-col gap-3">
            <ReactIntersectionObserver
              hasMore={hasMore}
              isLoading={isLoading}
              loadNext={loadNext}
              spinnerStyle="sticky top-[220px] left-0 flex w-full items-center justify-center"
            >
              {replies.map((reply) => (
                <PostReply
                  key={getId(reply)}
                  reply={reply}
                  openPopupImage={openPopupImage}
                  onReplyClick={(username: string) => {
                    setReplyInput((state) => ({ ...state, text: `@${username}` }));
                    setReplyParent(getReplyParent(reply));
                  }}
                  childReply={childReply}
                  setChildReply={setChildReply}
                  userInfo={userInfo}
                  handleDelete={() => {
                    deleteComment(reply.reference);
                  }}
                />
              ))}
            </ReactIntersectionObserver>
          </div>
        )}
        {!replies?.length && !hasMore && (
          <>
            <div className="flex flex-col items-start justify-start w-full bg-[#EEEEEE] rounded-2xl p-4">
              <span className="w-full text-start pl-1">
                Комментариев пока нет, будьте пионером и оставьте первый.
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};
