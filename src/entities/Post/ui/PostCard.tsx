'use client';
import 'moment/locale/ru';

import classNames from 'classnames';
import moment from 'moment';
import { useState } from 'react';

import { IPost } from '@/entities/Post/model/types';
import { ClassicPostMediaBody } from '@/entities/Post/ui/ClassicPostMediaBody';
import { PostMenu } from '@/entities/Post/ui/PostMenu';
import { PostPopup } from '@/entities/Post/ui/PostPopup';
import PostReactions from '@/entities/Post/ui/PostReactions';
import { useCustomPost } from '@/entities/Post/utils/hooks/useCustomPost';
import RelationInfo from '@/entities/Relations/ui/RelationInfo';
import { UserCard } from '@/entities/User/ui/UserCard';
import { useAuth } from '@/features/Auth/useAuth/useAuth';
import { deletePostHandler, viewPostHandler } from '@/shared/api/post';
import { BurgerIcon, CommentIcon, EyesOpenedIcon, ForwardIcon } from '@/shared/assets/icons';
import { viewportSizes } from '@/shared/consts';
import { useReactions } from '@/shared/hooks';
import { useAppSelector } from '@/shared/store/hooks';
import { userSelector } from '@/shared/store/selectors/user';
import { getId, lockBackground } from '@/shared/utils';

import type { CSSProperties, Dispatch, MouseEvent, SetStateAction } from 'react';
type PropTypes = {
  post: IPost;
  setPostList?: Dispatch<SetStateAction<IPost[]>>;
  openRepostPopup: (post: IPost) => void;
  openPopupImage: (image: string) => void;
};

const PostCard = ({ post, setPostList, openRepostPopup, openPopupImage }: PropTypes) => {
  const [isAdditionalDotsOpen, setIsAdditionalDotsOpen] = useState<boolean>(false);
  const [isPostModalShown, setIsPostModalShown] = useState(false);
  const [isPrevPostModalShown, setIsPrevPostModalShown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrevPostLoading, setIsPrevPostLoading] = useState(true);
  const { isLogged, executeQueryCallback } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userInfo = useAppSelector(userSelector);

  const { jsx: postJSX, customPostScale } = useCustomPost(post, 535, '', 1, setIsLoading);
  const { jsx: prevPostJSX, customPostScale: prevCustomPostScale } = useCustomPost(
    post.prev_post as IPost,
    560,
    '',
    0.95,
    setIsPrevPostLoading,
  );

  const { reactions, setReactions, handleReactionClick, prevPostReactions, setPrevPostReactions } =
    useReactions(post);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const deletePost = () => {
    executeQueryCallback((accessToken: string) => {
      deletePostHandler(getId(post), accessToken)
        .then(() => {
          if (setPostList) {
            setPostList((posts) => [
              ...posts.filter((currentPost) => getId(currentPost) !== getId(post)),
            ]);
          }
          setIsMenuOpen(false);
        })
        .catch((error) => {
          alert('Can not delete post');
          console.error(
            `Comments fetch failed with exception: ${error?.response?.data?.exc_code ?? error}`,
          );

          if (error?.response?.data?.message) {
            console.error(error?.response?.data?.message);
          }
        })
        .finally(() => {
          setIsAdditionalDotsOpen(false);
        });
    });
  };

  const setPostViewed = (postReference: string) => {
    if (isLogged) {
      executeQueryCallback((accessToken: string) => {
        void viewPostHandler(accessToken, postReference);
      });
    }
  };

  const handleClickPost = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsPostModalShown(true);
    lockBackground(true);
    setPostViewed(post.reference);
  };

  const handleClickPrevPost = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsPrevPostModalShown(true);

    lockBackground(true);
    setPostViewed(post.prev_post?.reference as string);
  };

  return (
    <>
      {isAdditionalDotsOpen && (
        <div
          className="h-screen w-screen fixed top-0 left-0 z-10 opacity-0"
          onClick={(e) => {
            e.stopPropagation();
            setIsAdditionalDotsOpen(false);
          }}
        />
      )}
      <div className="post-body relative bg-white rounded mt-4 cursor-pointer flex flex-col flex-nowrap w-[514px] max-[535px]:w-full drop-shadow">
        <div className="flex justify-between z-20">
          <div className="grid">
            <UserCard user={post.user} />
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
          <PostMenu
            deleteComment={deletePost}
            postUser={post.user}
            userInfo={userInfo}
            menuIcon={<BurgerIcon className="w-[20px] h-[20px]" />}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        </div>
        <div>
          {post.type !== 'CUSTOMIZED' ? null : (
            <div
              className="relative w-full overflow-hidden"
              style={
                {
                  height: `${viewportSizes['post'].height * customPostScale}px`,
                  '--viewport-width-scale': customPostScale,
                } as CSSProperties
              }
              onClick={handleClickPost}
            >
              {postJSX?.markup}
            </div>
          )}

          {post.type !== 'CLASSIC' ? null : (
            <div className="mt-1 h-auto">
              <p className="p-2 break-words w-full whitespace-pre-wrap" onClick={handleClickPost}>
                {post.body.text}
              </p>

              <ClassicPostMediaBody
                post={post}
                setPostViewed={setPostViewed}
                openPopupImage={openPopupImage}
              />

              {post.prev_post && !isPrevPostLoading ? (
                <div
                  className="p-2 hover:bg-green-100 transition-all ease-in bg-white rounded cursor-pointer flex flex-col flex-nowrap w-full border-2"
                  onClick={handleClickPrevPost}
                >
                  <div className="flex justify-between z-20">
                    <div className="grid">
                      <UserCard
                        user={post.prev_post.user}
                        className="rounded p-[5px] flex gap-3 justify-between"
                      />
                      <div className="flex text-sm items-center gap-3 p-2">
                        <span className="flex flex-col text-[#707579] text-sm">
                          {moment(post.prev_post.created_at).locale('ru').fromNow()}
                        </span>
                        <span className="text-[#707579] text-sm">•</span>
                        <span className="text-sm">
                          <RelationInfo user={post.prev_post.user} />
                        </span>
                      </div>
                    </div>
                  </div>
                  {post.prev_post.type !== 'CUSTOMIZED' ? null : (
                    <div
                      className="relative w-full overflow-hidden"
                      style={
                        {
                          height: `${viewportSizes['post'].height * prevCustomPostScale}px`,
                          '--viewport-width-scale': prevCustomPostScale,
                        } as CSSProperties
                      }
                    >
                      {prevPostJSX?.markup}
                    </div>
                  )}

                  {post.prev_post.type !== 'CLASSIC' ? null : (
                    <div className="h-auto p-2">
                      <p className="p-2 break-words w-full whitespace-pre-wrap">
                        {post.prev_post.body.text}
                      </p>
                      <ClassicPostMediaBody
                        post={post.prev_post}
                        setPostViewed={setPostViewed}
                        openPopupImage={openPopupImage}
                      />
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
        <div className="p-2 flex justify-center items-center gap-3">
          <PostReactions
            reactions={reactions}
            handleReactionClick={handleReactionClick}
            prefix="pc"
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
              <span className="text-sm font-bold">{post.total_replies}</span>
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
              <span className="text-sm font-bold">{post.total_reposts}</span>
            ) : null}
          </div>
          <div
            className={classNames(
              'hover:bg-gray-100 transition-all ease-in p-2 rounded-xl',
              post.total_views && 'flex justify-center items-center gap-3',
            )}
          >
            <EyesOpenedIcon className="w-[24px] h-[24px]" fill={'black'} strokeWidth={'1'} />
            {post.total_views != 0 ? (
              <span className="text-sm font-bold">{post.total_views}</span>
            ) : null}
          </div>
        </div>
      </div>
      {!isPostModalShown ? null : (
        <PostPopup
          post={post}
          handleClose={(isDisplayed) => {
            setIsPostModalShown(isDisplayed);
            lockBackground(false);
          }}
          reactions={reactions}
          setReactions={setReactions}
          key={getId(post)}
          setPostViewed={setPostViewed}
          openPopupImage={openPopupImage}
          openRepostPopup={openRepostPopup}
          setIsPostModalShown={setIsPostModalShown}
        />
      )}
      {!isPrevPostModalShown ? null : (
        <PostPopup
          post={post.prev_post as IPost}
          handleClose={(isDisplayed) => {
            setIsPrevPostModalShown(isDisplayed);
            lockBackground(false);
          }}
          reactions={prevPostReactions}
          setReactions={setPrevPostReactions}
          key={getId(post.prev_post)}
          setPostViewed={setPostViewed}
          openPopupImage={openPopupImage}
          openRepostPopup={openRepostPopup}
          setIsPostModalShown={setIsPrevPostModalShown}
        />
      )}
      <div
        className={classNames(
          isAdditionalDotsOpen ? 'block' : 'hidden',
          'fixed bg-[#212330] p-2 transition-all ease-in-out z-20',
        )}
      >
        <button
          className="text-white hover:text-red-500 transition-all ease-out"
          onClick={(e) => {
            e.stopPropagation();
            deletePost();
          }}
        >
          Удалить пост
        </button>
      </div>
    </>
  );
};
export default PostCard;
