'use client';
import classNames from 'classnames';
import { Fragment, useCallback, useEffect, useState } from 'react';

import { IPost } from '@/entities/Post/model/types';
import PostCard from '@/entities/Post/ui/PostCard';
import { useAuth } from '@/features/Auth/useAuth/useAuth';
import { GetPostsHandler } from '@/features/Post/types';
import ReactIntersectionObserver from '@/shared/ui/ReactIntersectionObserver';
import { lockBackground } from '@/shared/utils';
import CreateClassicPostForm from '@/widgets/CreateClassicPostForm/ui/CreateClassicPostForm';
import YandexAdsBar from '@/widgets/YandexAdsBar/YandexAdsBar';

interface IProps {
  isMe: boolean;
  getPostsHandler: GetPostsHandler;
}

export const PostList = ({ getPostsHandler, isMe }: IProps) => {
  const [isRepostPopupOpen, setIsRepostPopupOpen] = useState(false);
  const [repostPost, setRepostPost] = useState<IPost | null>(null);
  const [popupImageData, setPopupImageData] = useState<string>('');
  const [isPopupImageOpen, setIsPopupImageOpen] = useState<boolean>(false);
  const [yandexAd, setYandexAd] = useState<JSX.Element | null>(null);

  const [postList, setPostList] = useState<IPost[]>([]);

  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { isLogged, executeQueryCallback } = useAuth();

  // TODO: надо исправить! Пока не работает: https://qna.habr.com/q/495253, показ ленты с бесконечной прокруткой
  useEffect(() => {
    const ad = <YandexAdsBar yandexId={'yandex_rtb_R-A-6580598-4'} blockId={'R-A-6580598-4'} />;
    setYandexAd(ad);
  }, []);

  const openRepostPopup = (post: IPost) => {
    setIsRepostPopupOpen(true);
    lockBackground(true);
    setRepostPost(post);
  };
  const closeRepostPopup = () => {
    setIsRepostPopupOpen(false);
    lockBackground(false);
    setRepostPost(null);
  };
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

  const appendPost = useCallback(
    (response: IPost) => {
      setPostList?.((prev) => [response, ...prev]);
    },
    [setPostList],
  );

  const loadNext = useCallback(
    () =>
      executeQueryCallback((accessToken: string) => {
        const dateCursorId = new Date();
        const limit = 10;
        if (hasMore && !isLoading) {
          setIsLoading(true);
          setOffset((prev) => prev + limit);
          void getPostsHandler(offset, limit, dateCursorId, accessToken)
            .then((res) => {
              setPostList?.((prev) => [...prev, ...res.items]);
              setHasMore(res.items.length >= limit);
              setIsLoading(false);
            })
            .catch((e) => {
              console.log(e);
              setHasMore(false);
              setIsLoading(false);
            });
        }
      }),
    [hasMore, isLoading, offset, setPostList, getPostsHandler, executeQueryCallback],
  );

  const repostPostPopup = isRepostPopupOpen ? (
    <div
      className={classNames(
        isRepostPopupOpen ? 'flex' : 'hidden',
        'h-screen w-screen fixed top-0 flex-col items-center left-0 justify-center bg-black/50 overflow-hidden z-50 p-2',
      )}
      onClick={(e) => {
        e.stopPropagation();
        closeRepostPopup();
      }}
    >
      <div
        className="flex flex-col w-[400px] max-[420px]:w-full bg-white p-5 rounded-3xl overflow-hidden gap-5 overflow-y-scroll"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="grid gap-3">
          <h1 className="text-2xl text-center font-bold">Репост</h1>
          <div className="flex gap-3">
            <input type="radio" id="mywall" defaultChecked={true} />
            <label htmlFor="mywall">Моя стенка</label>
          </div>
          <CreateClassicPostForm
            formType={'repost'}
            repostPost={repostPost}
            appendPost={appendPost}
            closeRepostPopup={closeRepostPopup}
            className="mt-5 bg-[#DDDDDD] mb-5 p-5 rounded-[5px] w-full"
          />
        </div>
      </div>
    </div>
  ) : null;

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
      {repostPostPopup}
      {isLogged && isMe ? (
        <CreateClassicPostForm
          appendPost={appendPost}
          className="mt-5 bg-[#DDDDDD] mb-5 p-5 rounded-[5px] w-[514px] max-[535px]:w-full"
        />
      ) : null}

      <ReactIntersectionObserver hasMore={hasMore} isLoading={isLoading} loadNext={loadNext}>
        {postList.length ? (
          <>
            {postList.map((post, index) => (
              <Fragment key={index}>
                {(index + 1) % 5 === 0 ? (
                  // TODO надо исправить! Пока не работает
                  // <YandexAdsRecommendation yandexId={'yandex_rtb_C-A-6580598-5'} blockId={'C-A-6580598-5'} />
                  <div className="mt-4 cursor-pointer w-[514px] max-[535px]:w-full drop-shadow max-h-[300px]">
                    {yandexAd}
                  </div>
                ) : (
                  <PostCard
                    post={post}
                    setPostList={setPostList}
                    openRepostPopup={openRepostPopup}
                    openPopupImage={openPopupImage}
                  />
                )}
              </Fragment>
            ))}
          </>
        ) : !isLoading && isMe ? (
          <span className="text-2xl font-semibold">Постов нет, пригласите или найдите друзей!</span>
        ) : null}
      </ReactIntersectionObserver>
    </>
  );
};
