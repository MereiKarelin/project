import classNames from 'classnames';
import moment from 'moment';
import { CSSProperties, Dispatch, SetStateAction, useEffect, useState } from 'react';

import {
  IClassicBody,
  IPost,
  IReply,
  UserReaction,
  UserReactionStructure,
} from '@/entities/Post/model/types';
import { ScrollPosition } from '@/entities/Post/types';
import {
  ClassicPostMediaBody,
  PostComments,
  PostReactions,
  SendReply,
  scrollShadowTop,
} from '@/entities/Post/ui';
import { useCustomPost } from '@/entities/Post/utils/hooks/useCustomPost';
import RelationInfo from '@/entities/Relations/ui/RelationInfo';
import { UserCard } from '@/entities/User/ui/UserCard';
import { useAuth } from '@/features';
import { uploadImageHandler } from '@/shared/api/file';
import {
  assignReactionStructureToPostHandler,
  getPostCommentsHandler,
  removeReactionStructureFromPostHandler,
  replyToPostHandler,
} from '@/shared/api/post';
import { CommentIcon, EyesOpenedIcon, ForwardIcon } from '@/shared/assets/icons';
import { viewportSizes } from '@/shared/consts';
import { UploadedFile } from '@/shared/types';
import { getId, isScrollAtBottom, isScrollAtTop, lockBackground } from '@/shared/utils';
import { logBackendError } from '@/shared/utils/error';

import { useComments } from '../utils/hooks';
import { ChildReply } from './types';

type PropTypes = {
  handleClose: (isShown: boolean) => void;
  reactions: UserReactionStructure[] | undefined;
  setReactions: Dispatch<SetStateAction<UserReactionStructure[] | undefined>>;
  post: IPost;
  setPostViewed: (postReference: string) => void;
  openPopupImage: (image: string) => void;
  openRepostPopup: (post: IPost) => void;
  setIsPostModalShown: Dispatch<SetStateAction<boolean>>;
};

const blankReplyInput = {
  reference: '',
  text: '',
  image_url: null,
  video_url: null,
};

export const PostPopup = ({
  handleClose,
  reactions,
  setReactions,
  post,
  setPostViewed,
  openPopupImage,
  openRepostPopup,
  setIsPostModalShown,
}: PropTypes) => {
  const [replies, setReplies] = useState<IReply[]>([] as IReply[]);
  const [replyInput, setReplyInput] = useState<IClassicBody>(blankReplyInput);
  const [isFetchingResponse, setIsFetchingResponse] = useState(false);
  const [isReplyValid, setIsReplyValid] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[] | undefined>();
  const [replyParent, setReplyParent] = useState<IPost | IReply>(post);
  const [childReply, setChildReply] = useState<ChildReply>();

  const [scrollPositionContent, setScrollPositionContent] = useState<ScrollPosition>({
    isTop: true,
    isBottom: true,
  });

  const { hasMoreComments, isLoadingComments, loadMoreComments } = useComments(
    post,
    setReplies,
    getPostCommentsHandler,
  );

  const { jsx: postJSX, customPostScale } = useCustomPost(post, 514, 'post-popup-viewport', 10000);

  const { executeQueryCallback } = useAuth();

  useEffect(() => {
    const postPopupContent = document.getElementById('post-popup-content') as HTMLDivElement;
    if (postPopupContent) {
      setScrollPositionContent(() => ({
        isTop: isScrollAtTop(postPopupContent, 33),
        isBottom: isScrollAtBottom(postPopupContent, 33),
      }));
    }
  }, []);

  const scrollToBottom = () => {
    const element = document.getElementById('post-popup-content');
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
    const isValid = !!(replyInput.text || replyInput.image_url || replyInput.video_url);
    setIsReplyValid(isValid);
  }, [replyInput]);

  const updateReactionCount = (
    reaction: UserReactionStructure,
    total_reactions: number,
    user_reaction: UserReaction | null,
  ) => {
    const updatedReaction = {
      ...reaction,
      total_reactions: total_reactions,
      user_reaction: user_reaction,
    };
    let updatedReactions: UserReactionStructure[] = [];
    if (reactions) {
      updatedReactions = reactions.map((r) => {
        if (getId(r) === getId(reaction)) {
          return updatedReaction;
        } else {
          return r;
        }
      });
    } else {
      updatedReactions = [updatedReaction];
    }

    setReactions(() => [...updatedReactions]);
  };

  const handleReactionClick = (reaction: UserReactionStructure) => {
    executeQueryCallback((accessToken: string) => {
      if (!reaction.user_reaction) {
        const requestBody = new FormData();
        requestBody.append('structure_reference', getId(reaction).toString());
        requestBody.append('description', reaction.name);
        requestBody.append(
          'user_reaction',
          JSON.stringify({ structure_reference: getId(reaction), description: reaction.name }),
        );
        assignReactionStructureToPostHandler(post.reference, requestBody, accessToken)
          .then((response) => {
            const postsReactions = response;
            const updatedReaction: UserReactionStructure = postsReactions.filter(
              (r: UserReactionStructure) => getId(r) === getId(reaction),
            )?.[0];
            const userReaction = updatedReaction?.user_reaction ?? null;
            updateReactionCount(reaction, reaction.total_reactions + 1, userReaction);
          })
          .catch((error) => {
            logBackendError(error, 'Reaction assignment failed');
          });
      } else {
        //remove reaction from post
        removeReactionStructureFromPostHandler(post.reference, getId(reaction), accessToken)
          .then(() => {
            updateReactionCount(reaction, reaction.total_reactions - 1, null);
          })
          .catch((error) => {
            logBackendError(error, 'Reaction removal failed');
          });
      }
    });
  };

  const handleSubmitReply = () => {
    if (isFetchingResponse) return;

    if (!replyInput.text && !uploadedImages?.length && !replyInput.video_url) {
      alert('Комментарий не должен быть пустым');
      return;
    }

    executeQueryCallback(async (accessToken: string) => {
      const parentReference = replyParent.reference;
      setIsFetchingResponse(true);

      let reply = replyInput;

      if (uploadedImages?.length) {
        const formData = new FormData();
        const file = uploadedImages[0].file;
        if (file) {
          formData.append('name', file.name);
          formData.append('file', file);
          try {
            const response = await uploadImageHandler(formData, accessToken);
            reply = { ...replyInput, image_url: response.url };
          } catch (error: any) {
            logBackendError(
              error,
              'Image upload failed with exception',
              true,
              'Reply could not be sent',
            );
            return;
          }
        }
      }

      replyToPostHandler(parentReference, reply, accessToken)
        .then((response) => {
          setReplyInput(blankReplyInput);
          setUploadedImages(undefined);
          if (replyParent === post) {
            setReplies((state) => [...state, response]);
          } else {
            const parent = replyParent as IReply;
            setChildReply({ parent, reply: response });
            setReplyParent(post);
          }
        })
        .catch((error: any) => {
          logBackendError(
            error,
            'Senging reply failed with exception',
            true,
            'Reply could not be sent',
          );
        })
        .finally(() => setIsFetchingResponse(false));
    });
  };

  return (
    <div
      className="h-screen w-screen fixed top-0 flex flex-col items-center left-0 justify-center bg-black/50 z-40 overflow-y-scroll"
      onClick={(e) => {
        e.stopPropagation();
        handleClose(false);
      }}
    >
      <div
        className="post-body relative flex flex-col bg-white p-2 rounded-xl overflow-hidden justify-between md:w-5/6 xl:w-3/6 w-fit "
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex flex-col h-full bg-white">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              {!post?.user ? null : <UserCard user={post.user} />}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose(false);
                }}
                className="cursor-pointer text-xl font-semibold p-2 text-blue-500"
              >
                Назад
              </span>
            </div>
            <div className="flex text-sm items-center gap-3 p-2">
              <span className="flex flex-col text-[#707579] text-sm">
                {moment(post.created_at).locale('ru').fromNow()}
              </span>
              <span className="text-[#707579] text-sm">•</span>
              <span className="text-sm">
                <RelationInfo user={post.user} />
              </span>
            </div>
          </div>
          <div className="p-2 flex justify-center items-center gap-3">
            <PostReactions
              reactions={reactions}
              handleReactionClick={handleReactionClick}
              prefix="pp"
            />
            <div
              onClick={() => {
                setIsPostModalShown(true);
                lockBackground(true);
                setPostViewed(post.reference);
              }}
              className={classNames(
                'hover:bg-green-100 transition-all ease-in p-2 rounded-xl',
                post.total_replies && 'flex justify-center items-center gap-3',
              )}
            >
              <CommentIcon className="w-[24px] h-[24px]" />
              {post.total_replies != 0 ? (
                <span className="text-md">{post.total_replies}</span>
              ) : null}
            </div>
            <div
              onClick={() => {
                openRepostPopup(post);
                setPostViewed(post.reference);
              }}
              className={classNames(
                'hover:bg-blue-100 transition-all ease-in p-2 rounded-xl',
                post.total_reposts && 'flex justify-center items-center gap-3',
              )}
            >
              <ForwardIcon className="w-[24px] h-[24px]" />
              {post.total_reposts != 0 ? (
                <span className="text-md">{post.total_reposts}</span>
              ) : null}
            </div>
            <div
              className={classNames(
                'hover:bg-gray-100 transition-all ease-in p-2 rounded-xl',
                post.total_views && 'flex justify-center items-center gap-3',
              )}
            >
              <EyesOpenedIcon className="w-[24px] h-[24px]" fill={'black'} strokeWidth={'1'} />
              {post.total_views != 0 ? <span className="text-md">{post.total_views}</span> : null}
            </div>
          </div>
          <div
            id="post-popup-content"
            className={classNames(
              'relative flex flex-col bg-white/30 gap-3 h-full w-full overflow-y-scroll',
            )}
            onScroll={(e) => {
              const element = e.target as HTMLDivElement;

              setScrollPositionContent(() => ({
                isTop: isScrollAtTop(element, 33),
                isBottom: isScrollAtBottom(element, 33),
              }));
            }}
          >
            {scrollShadowTop(scrollPositionContent.isTop)}

            {post.type !== 'CUSTOMIZED' ? null : (
              <div
                id="post-popup-viewport"
                className="relative w-full overflow-hidden flex-shrink-0"
                style={
                  {
                    height: `${viewportSizes['post'].height * customPostScale}px`,
                    '--viewport-width-scale': customPostScale,
                  } as CSSProperties
                }
              >
                {postJSX?.markup}
              </div>
            )}

            {post.type !== 'CLASSIC' ? null : (
              <>
                <p className="p-2 break-words w-full whitespace-pre-wrap">{post?.body.text}</p>
                <ClassicPostMediaBody
                  post={post}
                  setPostViewed={setPostViewed}
                  openPopupImage={openPopupImage}
                />
                {/*  TODO Добавить в попап поста предыдущий пост и что если кликнуть на него то открыть попап, а предыдущий закрыть*/}
              </>
            )}

            <PostComments
              replies={replies}
              setReplies={setReplies}
              hasMore={hasMoreComments}
              isLoading={isLoadingComments}
              loadNext={loadMoreComments}
              setReplyInput={setReplyInput}
              setReplyParent={setReplyParent}
              childReply={childReply}
              setChildReply={setChildReply}
            />
          </div>
          <SendReply
            replyInput={replyInput}
            setReplyInput={setReplyInput}
            handleSubmit={() => handleSubmitReply()}
            isFetchingResponse={isFetchingResponse}
            isReplyValid={isReplyValid}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
          />
        </div>
      </div>
    </div>
  );
};
