import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { IDirectChat } from '@/entities/DirectChat/types';
import { useAuth } from '@/features/Auth/useAuth/useAuth';
import { sendMessageHandler } from '@/features/DirectChats/api/directChatsApi';
import {
  onWebsocketStopActionStatus,
  onWebsocketWritingStatus,
} from '@/features/DirectChats/api/websocketCommands';
import { uploadImageHandler } from '@/shared/api/file';
import ArrowSendIcon from '@/shared/assets/icons/ArrowSendIcon';
import GalleryDownloadIcon from '@/shared/assets/icons/GalleryDownload';
import { usePasteImages } from '@/shared/hooks/usePasteImages';
import { UploadedFile } from '@/shared/types';
import FileInput from '@/shared/ui/FileInput/FileInput';
import { logBackendError } from '@/shared/utils/error';

interface IProps {
  setMessagesOffsetHeight: (height: number) => void;
  wss: WebSocket | null;
  selectedChat: IDirectChat;
  appendMessage: (reference: string, text: string, images: any) => void;
}

export const SendMessageFooter = ({
  appendMessage,
  setMessagesOffsetHeight,
  wss,
  selectedChat,
}: IProps) => {
  const [isLockSendTypingStatus, setIsLockSendTypingStatus] = useState(false);
  const [textChat, setTextChat] = useState('');
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[] | undefined>();

  const typingTimeoutRef = useRef<any>(null);

  const { executeQueryCallback } = useAuth();

  const handleTextareaChange = (e: any) => {
    onMessageWriting(e.target.value);
    setTextChat(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    const minHeight = 48;
    const newOffsetHeight = Math.max(e.target.scrollHeight, minHeight);
    setMessagesOffsetHeight(newOffsetHeight);
  };

  const onSubmit = () => {
    console.log('textChat', textChat);
    console.log('uploadedImages', uploadedImages);
    if (!textChat.trim() && !uploadedImages) {
      console.log('empty message');
      return;
    }
    const reference = uuidv4();
    appendMessage(reference, textChat, uploadedImages);
    if (uploadedImages && uploadedImages.length > 0) {
      const images: any = [];
      uploadImages(images).then(() => {
        console.log('images', images);
        sendMessage(selectedChat.reference, textChat, images, reference);
      });
    } else if (textChat.trim()) {
      sendMessage(selectedChat.reference, textChat, [], reference);
    }
  };

  const uploadImages = useCallback(
    (images: UploadedFile[]) => {
      for (const image of uploadedImages as any) {
        const formData = new FormData();
        const file = image.file;
        if (file) {
          return executeQueryCallback(async (accessToken: string) => {
            formData.append('name', file.name);
            formData.append('file', file);
            try {
              const response = await uploadImageHandler(formData, accessToken);
              images.push(response.url);
            } catch (error: any) {
              logBackendError(
                error,
                'Image upload failed with exception',
                true,
                'Message could not be sent',
              );
              return;
            }
          });
        }
      }
    },
    [uploadedImages, executeQueryCallback],
  );

  const sendMessage = (chatReference: string, text: string, images: any, reference: string) => {
    executeQueryCallback((accessToken: string) => {
      if (wss?.readyState == 1) {
        wss?.send(JSON.stringify(onWebsocketStopActionStatus(accessToken)));
      }
      setTimeout(() => {
        void sendMessageHandler(chatReference, text, images, reference)
          .then(() => {
            const textarea = document.getElementById('chatTextarea') as HTMLTextAreaElement;
            textarea.style.height = '48px';
            setTextChat('');
            setUploadedImages([]);
            setMessagesOffsetHeight(48);
          })
          .catch((error) => {
            console.log('sendMessageHandler failed: ', error);
          });
      }, 100);
    });
  };

  const onMessageWriting = (value: string) => {
    // Очищаем предыдущий таймер при каждом вводе, чтобы предотвратить его срабатывание, если пользователь продолжает печатать
    clearTimeout(typingTimeoutRef.current);

    executeQueryCallback((accessToken: string) => {
      if (!isLockSendTypingStatus && value.trim() !== '') {
        // Пользователь начал печатать, и мы отправляем статус "печатается" только один раз в начале печати
        setIsLockSendTypingStatus(true);
        if (wss?.readyState == 1) {
          wss?.send(JSON.stringify(onWebsocketWritingStatus(accessToken)));
        }
      }

      if (value.trim() === '') {
        // Если строка пуста, сразу отправляем статус остановки и не устанавливаем таймер
        if (wss?.readyState == 1) {
          wss?.send(JSON.stringify(onWebsocketStopActionStatus(accessToken)));
        }
        setIsLockSendTypingStatus(false);
      } else {
        // Перезапускаем таймер, чтобы отправить статус "печать остановлена", только если пользователь перестал печатать
        typingTimeoutRef.current = setTimeout(() => {
          console.log('timeout send typing status');
          if (wss?.readyState == 1) {
            wss?.send(JSON.stringify(onWebsocketStopActionStatus(accessToken)));
          }
          setIsLockSendTypingStatus(false);
        }, 3000);
      }
    });
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handlePaste = (imageFile: UploadedFile) => {
    setUploadedImages(() => [imageFile]);
  };

  usePasteImages('chatTextarea', handlePaste);

  const onClearImage = () => {
    setUploadedImages(undefined);
  };

  return (
    <div className="flex gap-3 border-t border-b-gray-200 fixed bottom-0 p-2 z-[1000] min-h-[60px] w-full rounded-b-[20px] bg-white">
      <div className="bottom-3 right-3 cursor-pointer hover:bg-gray-300 hover:opacity-100 opacity-50 p-2 rounded-xl">
        <FileInput
          uploadedFiles={uploadedImages}
          setUploadedFiles={setUploadedImages}
          acceptType="image"
          icon={<GalleryDownloadIcon />}
          size={uploadedImages?.length ? '128' : '32'}
          onRemoveClick={onClearImage}
        />
      </div>
      <textarea
        id="chatTextarea"
        className="w-full outline-none resize-none overflow-hidden"
        placeholder="Введите сообщение"
        onChange={handleTextareaChange}
        value={textChat}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();

            onSubmit();
          }
        }}
        maxLength={1000}
      />
      <div
        className="cursor-pointer grid items-center"
        onClick={() => {
          onSubmit();
        }}
      >
        <ArrowSendIcon />
      </div>
    </div>
  );
};
