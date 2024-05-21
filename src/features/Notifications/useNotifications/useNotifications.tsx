'use client';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { INotification } from '@/entities/Notification/types';
import { useAuth } from '@/features/Auth/useAuth/useAuth';
import {
  getNotificationsCountsHandler,
  getNotificationsHandler,
} from '@/features/Notifications/api/notificationsApi';
import { onWebsocketJoinCommand } from '@/features/Notifications/api/websocketCommands';
import { useAppSelector } from '@/shared/store/hooks';
import { userSelector } from '@/shared/store/selectors/user';
import { consoleLog } from '@/shared/utils';

interface useNotificationContextType {
  wss: WebSocket | null;
  totalUnreadNotifications: number;
  setTotalUnreadNotifications: Dispatch<SetStateAction<number>>;
  unreadNotifications: INotification[];
  unreadNotificationsFromChats: INotification[];
  totalUnreadNewMessages: number;
  setTotalUnreadNewMessages: Dispatch<SetStateAction<number>>;
}

const NotificationContext = createContext<useNotificationContextType>(
  {} as useNotificationContextType,
);

const audioFilename = 'https://cdn.yourbandy.com/public/audio/notification-4.mp3';
export const NotificationProvider = ({ children }: any) => {
  const [wss, setWss] = useState<WebSocket | null>(null);
  const [totalUnreadNotifications, setTotalUnreadNotifications] = useState<number>(0);
  const [totalUnreadNewMessages, setTotalUnreadNewMessages] = useState<number>(0);
  const [unreadNotifications, setUnreadNotifications] = useState<INotification[]>([]);
  const [unreadNotificationsFromChats, setUnreadNotificationsFromChats] = useState<INotification[]>(
    [],
  );
  const isConnecting = useRef(false);
  const { isLogged, executeQueryCallback } = useAuth();
  const [chatIds] = useState<Set<string>>(new Set());
  const userInfo = useAppSelector(userSelector);

  const connectToWebsocket = useCallback(() => {
    if (isConnecting.current || !isLogged) return;

    isConnecting.current = true;
    if (wss) {
      wss.close();
    }
    const socket = new WebSocket(`${process.env.WEBSOCKET_URL}/ws/v1/notifications`);
    consoleLog('created WebSocket');
    consoleLog(socket);

    setWss(socket);
  }, [isLogged, wss]);

  useEffect(() => {
    if (isLogged) return;
    setTotalUnreadNotifications(0);
    setUnreadNotifications([]);
    if (wss) {
      wss.close();
    }
  }, [isLogged, wss]);

  useEffect(() => {
    if (!isLogged || !wss) return;

    // Track chat IDs to determine if a message is from a new chat
    wss.onopen = () => {
      executeQueryCallback((accessToken: string) => {
        wss.send(JSON.stringify(onWebsocketJoinCommand(accessToken)));
        consoleLog('WebSocket Connected');
        isConnecting.current = false;
      });
    };

    wss.onmessage = (event) => {
      const websocketMessage: INotification = JSON.parse(event.data);
      consoleLog('NOTIFICATION WEBSOCKET: ');
      consoleLog(websocketMessage);

      if (
        websocketMessage.status != 'JOINED_TO_NOTIFICATIONS' &&
        websocketMessage.target_user_reference == userInfo?.reference
      ) {
        if (websocketMessage.type === 'NEW_MESSAGE') {
          const notificationSound = new Audio(audioFilename);

          notificationSound.currentTime = 0;
          void notificationSound.play();

          // Assuming websocketMessage includes a chatId field
          const isNewChatMessage = !chatIds.has(websocketMessage.body.chat_reference);
          consoleLog(chatIds);
          if (isNewChatMessage) {
            chatIds.add(websocketMessage.body.chat_reference);
            setTotalUnreadNotifications((prev) => prev + 1);
          }
          setTotalUnreadNewMessages((prev) => prev + 1);
          setUnreadNotificationsFromChats((prev) => [websocketMessage, ...prev]);
        } else if (websocketMessage.type === 'NEW_FOLLOWER') {
          const notificationSound = new Audio(audioFilename);
          notificationSound.currentTime = 0;
          void notificationSound.play();

          setTotalUnreadNotifications((prev) => prev + 1);
          setUnreadNotifications((prev) => [websocketMessage, ...prev]);
        } else if (websocketMessage.type === 'NEW_REPLY') {
          const notificationSound = new Audio(audioFilename);
          notificationSound.currentTime = 0;
          void notificationSound.play();

          setTotalUnreadNotifications((prev) => prev + 1);
          setUnreadNotifications((prev) => [websocketMessage, ...prev]);
        } else if (websocketMessage.type === 'NEW_FRIEND') {
          const notificationSound = new Audio(audioFilename);
          notificationSound.currentTime = 0;
          void notificationSound.play();

          setTotalUnreadNotifications((prev) => prev + 1);
          setUnreadNotifications((prev) => [websocketMessage, ...prev]);
        } else if (websocketMessage.type === 'NEW_REPOST') {
          const notificationSound = new Audio(audioFilename);
          notificationSound.currentTime = 0;
          void notificationSound.play();

          setTotalUnreadNotifications((prev) => prev + 1);
          setUnreadNotifications((prev) => [websocketMessage, ...prev]);
        } else if (websocketMessage.type === 'NEW_REACTION') {
          const notificationSound = new Audio(audioFilename);
          notificationSound.currentTime = 0;
          void notificationSound.play();

          setTotalUnreadNotifications((prev) => prev + 1);
          setUnreadNotifications((prev) => [websocketMessage, ...prev]);
        } else if (websocketMessage.type === 'NEW_POST') {
          const notificationSound = new Audio(audioFilename);
          notificationSound.currentTime = 0;
          void notificationSound.play();

          setTotalUnreadNotifications((prev) => prev + 1);
          setUnreadNotifications((prev) => [websocketMessage, ...prev]);
        }
      }
    };

    wss.onclose = (event) => {
      consoleLog('WebSocket Disconnected. Attempting to reconnect...');
      consoleLog(event);
      if (!event.wasClean) {
        setTimeout(() => connectToWebsocket(), 5000);
      }
    };

    wss.onerror = (error) => {
      console.error(`Ошибка: ${error}`);
      isConnecting.current = false;
    };
  }, [chatIds, connectToWebsocket, executeQueryCallback, isLogged, userInfo?.reference, wss]);

  useEffect(() => {
    if (!isLogged) return;
    const dateCursorId = new Date();
    const limit = 10;

    executeQueryCallback((accessToken: string) => {
      void getNotificationsHandler(0, limit, dateCursorId, accessToken).then((res) => {
        setTotalUnreadNotifications(res.total);
        setUnreadNotifications(res.items);
        res.items.forEach((item: INotification) => {
          chatIds.add(item.body.chat_reference);
        });
      });

      void getNotificationsCountsHandler(accessToken).then((res) => {
        if (!res) return;
        setTotalUnreadNewMessages(res.private_chats_count);
      });
      connectToWebsocket();
    });

    return () => {
      wss?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatIds, connectToWebsocket, isLogged, wss]);

  return (
    <NotificationContext.Provider
      value={{
        wss,
        totalUnreadNotifications,
        setTotalUnreadNotifications,
        unreadNotifications,
        unreadNotificationsFromChats,
        totalUnreadNewMessages,
        setTotalUnreadNewMessages,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
