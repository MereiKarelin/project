import classNames from 'classnames';
import { ReactNode, useCallback, useEffect, useState } from 'react';

import { IDirectChat } from '@/entities/DirectChat/types';
import { DirectChatCard } from '@/entities/DirectChat/ui/DirectChatCard';
import { useAuth } from '@/features';
import { getDirectChatsHandler } from '@/features/DirectChats/api/directChatsApi';
import ReactIntersectionObserver from '@/shared/ui/ReactIntersectionObserver';

interface IProps {
  selectChat: (chat: IDirectChat | null) => void;
  selectedChat: IDirectChat | null;
  chatOpened: boolean;
}

const StyleWrapper = ({ children, chatOpened }: { children: ReactNode; chatOpened: boolean }) => {
  return (
    <div
      className={classNames(
        'overflow-y-scroll w-full block min-[514px]:w-[480px] h-full py-0 shrink',
        chatOpened && 'max-[960px]:hidden',
      )}
    >
      <div className="bg-white drop-shadow rounded-3xl overflow-x-hidden w-full flex flex-col gap-3 min-h-[100%]">
        {children}
      </div>
    </div>
  );
};

export const GetDirectChats = ({ selectChat, selectedChat, chatOpened }: IProps) => {
  const [list, setList] = useState<IDirectChat[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const { executeQueryCallback } = useAuth();

  //TODO: several notifications and chats are being created

  const loadNext = useCallback(
    (init = false) => {
      executeQueryCallback((accessToken: string) => {
        if (hasMore && !isLoading) {
          setIsLoading(true);

          const dateCursorId = new Date();
          const limit = 10;

          void getDirectChatsHandler(offset, limit, dateCursorId, accessToken)
            .then((res) => {
              if (init) {
                setList(() => [...res.items]);
                setOffset(() => limit);
              } else {
                setList((prev) => [...prev, ...res.items]);
                setOffset((prev) => prev + limit);
              }
              setHasMore(res.items.length >= limit);
            })
            .catch((error) => {
              console.error(
                `Direct chats fetch failed with exception: ${
                  error?.response?.data?.exc_code ?? error
                }`,
              );

              if (error?.response?.data?.message) {
                console.error(error?.response?.data?.message);
              }
              setHasMore(false);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      });
    },
    [hasMore, isLoading, offset, executeQueryCallback],
  );

  useEffect(() => {
    loadNext(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!list?.length)
    return (
      <StyleWrapper chatOpened={chatOpened}>
        <span className="self-center text-center">
          Пригласите друзей и начните интересное общение
        </span>
      </StyleWrapper>
    );

  return (
    <StyleWrapper chatOpened={chatOpened}>
      <ReactIntersectionObserver hasMore={hasMore} isLoading={isLoading} loadNext={loadNext}>
        {list?.map((chat: IDirectChat, index: number) => (
          <DirectChatCard
            key={index}
            chat={chat}
            selectChat={selectChat}
            selectedChat={selectedChat}
          />
        ))}
      </ReactIntersectionObserver>
    </StyleWrapper>
  );
};
