import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import { IDirectChat, IDirectMessage } from '@/entities/DirectChat/types';
import { DirectMessageCard } from '@/entities/DirectChat/ui/DirectMessageCard';
import { useAuth } from '@/features/Auth/useAuth/useAuth';
import { getDirectMessagesHandler } from '@/features/DirectChats/api/directChatsApi';
import { onWebsocketJoinCommand } from '@/features/DirectChats/api/websocketCommands';
import { useAppSelector } from '@/shared/store/hooks';
import { userSelector } from '@/shared/store/selectors/user';
import ReactIntersectionObserver from '@/shared/ui/ReactIntersectionObserver';
import { consoleLog } from '@/shared/utils';
import { SendMessageFooter } from '@/widgets/SendMessageFooter/SendMessageFooter';

interface IProps {
  selectedChat: IDirectChat | null;
  wss: WebSocket | null;
  setWss: (wss: WebSocket | null) => void;
  setIsTargetUserInChat: (isTargetUserInChat: boolean) => void;
  openPopupImage: (image: string) => void;
}

const audioFilename = 'https://cdn.yourbandy.com/public/audio/notification-2.mp3';

export const GetDirectMessages = ({
  selectedChat,
  wss,
  setWss,
  setIsTargetUserInChat,
  openPopupImage,
}: IProps) => {
  const [list, setList] = useState<IDirectMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [messagesOffsetHeight, setMessagesOffsetHeight] = useState(48);
  const [isTypingStatus, setIsTypingStatus] = useState(false);
  const [isLockReceiveTypingStatus, setIsLockReceiveTypingStatus] = useState(false);
  const [randomStatus, setRandomStatus] = useState('');
  const [isLockRandomStatus, setIsLockRandomStatus] = useState(false);
  const { executeQueryCallback } = useAuth();
  const isConnecting = useRef(false);
  const userInfo = useAppSelector(userSelector);

  useEffect(() => {
    if (selectedChat) {
      connectToWebsocket(selectedChat.reference);
    }
    return () => {
      wss?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat, wss]);

  const loadNext = useCallback(
    (init = false) => {
      executeQueryCallback((accessToken: string) => {
        if ((init || (hasMore && !isLoading)) && selectedChat) {
          setIsLoading(true);

          const dateCursorId = new Date();
          const limit = 10;
          const orderBy = 'desc';

          void getDirectMessagesHandler(
            selectedChat.reference,
            offset,
            limit,
            dateCursorId,
            orderBy,
            accessToken,
          )
            .then((res) => {
              setList((prev) => [...prev, ...res.items]);
              setHasMore(res.items.length >= limit);
              setOffset((prev) => prev + limit);
            })
            .catch((error) => {
              console.error(
                `Direct messages fetch failed with exception: ${
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
    [executeQueryCallback, isLoading, hasMore, offset, selectedChat],
  );
  const closeCurrentChat = () => {
    setList([]);
    setHasMore(true);
    setIsLoading(false);
    setOffset(0);
  };

  const connectToWebsocket = useCallback(
    (chatReference: string) => {
      executeQueryCallback((accessToken: string) => {
        if (isConnecting.current) return;
        isConnecting.current = true;
        if (wss) {
          wss.close();
        }

        const socket = new WebSocket(
          `${process.env.WEBSOCKET_URL || ' '}/ws/v1/private-chats/${chatReference}`,
        );
        consoleLog('created WebSocket2');
        consoleLog(socket);

        socket.onopen = () => {
          socket.send(JSON.stringify(onWebsocketJoinCommand(accessToken)));
          console.log('Соединение установлено');
          isConnecting.current = false;
          closeCurrentChat();
          loadNext(true);
        };
        socket.onmessage = (event) => {
          if (socket.readyState == 1) {
            console.log(`Получено сообщение: ${event.data}`);
            const websocketMessage = JSON.parse(event.data);

            try {
              if (websocketMessage.status == 'JOINED' && userInfo) {
                console.log('JOINED', websocketMessage);
                if (websocketMessage.user_reference !== userInfo?.reference) {
                  console.log({
                    'websocketMessage.user_reference': websocketMessage.user_reference,
                    'userInfo?.reference': userInfo?.reference,
                  });
                  setIsTargetUserInChat(true);
                }
              }
              if (websocketMessage.status == 'LEFT') {
                console.log('LEFT', websocketMessage);
                if (websocketMessage.user_reference !== userInfo?.reference) {
                  setIsTargetUserInChat(false);
                }
              }
              if (websocketMessage.command == 'SEND') {
                setList((prevList) => {
                  // Добавляем новое сообщение, если его нет в списке, а если он есть то обновляем его read_at
                  if (websocketMessage.user_reference != userInfo?.reference) {
                    const newMessageSound = new Audio(audioFilename);

                    newMessageSound.currentTime = 0;
                    void newMessageSound.play();
                    return [websocketMessage, ...prevList];
                  } else {
                    return prevList.map((msg) => {
                      if (msg.reference === websocketMessage.reference) {
                        return {
                          ...websocketMessage,
                          isSending: false,
                        };
                      }
                      return msg;
                    });
                  }
                });
              }
              if (websocketMessage.status == 'WRITING') {
                if (websocketMessage.user_reference !== userInfo?.reference) {
                  if (isLockReceiveTypingStatus) return;
                  setIsLockReceiveTypingStatus(true);

                  setIsTypingStatus(true);
                  setTimeout(() => {
                    setIsLockReceiveTypingStatus(false);
                  }, 5000);
                }
              }
              if (websocketMessage.status == 'STOP_ACTION') {
                if (websocketMessage.user_reference !== userInfo?.reference) {
                  setIsTypingStatus(false);
                }
              }
              if (websocketMessage.status == 'READ_ALL') {
                console.log('READ_ALL', websocketMessage);
                if (websocketMessage.user_reference !== userInfo?.reference) {
                  setList((prevList) => {
                    return prevList.map((msg) => {
                      if (msg.read_at === null) {
                        return {
                          ...msg,
                          read_at: new Date().toISOString(),
                        };
                      }
                      return msg;
                    });
                  });
                }
              }
            } catch (err) {
              console.log(err);
            }
          }
        };
        socket.onclose = (event) => {
          console.log('Соединение закрыто', event);
          if (!event.wasClean) {
            setTimeout(() => connectToWebsocket(chatReference), 5000);
          }
        };
        socket.onerror = (error) => {
          console.log(`Ошибка: ${error}`);
        };
        setWss(socket);
      });
    },
    [
      executeQueryCallback,
      wss,
      setWss,
      userInfo,
      setIsTargetUserInChat,
      isLockReceiveTypingStatus,
      loadNext,
    ],
  );

  useEffect(() => {
    closeCurrentChat();
  }, []);

  useEffect(() => {
    if (!isTypingStatus) return;
    if (isLockRandomStatus) return;
    const statuses = [
      'Печатает...',
      'Злобно печатает...',
      'Печатает с ошибками...',
      'Печатает медленно...',
      'Очень медленно печатает...',
      'Выбирает букву...',
      'Думает что написать...',
    ];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    setRandomStatus(randomStatus);
  }, [isLockRandomStatus, isTypingStatus]);

  useEffect(() => {
    if (!isTypingStatus) {
      setRandomStatus('');
      setIsLockRandomStatus(false);
    }
  }, [isTypingStatus]);

  const appendMessage = useCallback(
    (reference: string, text: string, images: any) => {
      setList((prevList) => {
        return [
          {
            reference: reference,
            chat_reference: selectedChat?.reference as string,
            user_reference: userInfo?.reference,
            text,
            images,
            created_at: new Date().toISOString(),
            read_at: null,
            edited_at: null,
            isSending: true,
          },
          ...prevList,
        ];
      });
    },
    [selectedChat, userInfo],
  );

  return (
    <>
      <div
        className={
          'flex flex-col-reverse overflow-scroll w-full p-2 absolute top-[93px] box-border'
        }
        style={{ bottom: messagesOffsetHeight + 'px' }}
      >
        <ReactIntersectionObserver
          hasMore={hasMore}
          isLoading={isLoading}
          loadNext={loadNext}
          isReversed={false}
        >
          <span className="mt-4 animate-bounce">{randomStatus}</span>
          {list.length ? (
            <>
              {list.map((message: IDirectMessage, index) => (
                <Fragment key={index}>
                  <DirectMessageCard
                    message={message}
                    isConfirmed={true}
                    openPopupImage={openPopupImage}
                  />
                  <br />
                </Fragment>
              ))}
            </>
          ) : !isLoading && !hasMore ? (
            <span className="self-center text-center">Начните диалог с добрых вестей!</span>
          ) : null}
        </ReactIntersectionObserver>
      </div>
      {selectedChat ? (
        <>
          <SendMessageFooter
            setMessagesOffsetHeight={setMessagesOffsetHeight}
            wss={wss}
            selectedChat={selectedChat}
            appendMessage={appendMessage}
          />
        </>
      ) : null}
    </>
  );
};
