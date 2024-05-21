import { useRouter } from 'next/navigation';

import { IDirectChat } from '@/entities/DirectChat/types';
import { useAuth } from '@/features/Auth/useAuth/useAuth';
import {
  createDirectChatHandler,
  getDirectChatBetweenUsersHandler,
} from '@/features/DirectChats/api/directChatsApi';
import { useLogin } from '@/shared/hooks';

interface IProps {
  targetUserReference: string;
}

export const CreateDirectChat = ({ targetUserReference }: IProps) => {
  const router = useRouter();
  const { setIsPopupLoginFormOpen } = useLogin();
  const { isLogged, executeQueryCallback } = useAuth();

  const createDirectChat = () => {
    if (!isLogged) {
      setIsPopupLoginFormOpen(true);
      return;
    }
    executeQueryCallback((accessToken: string) => {
      void createDirectChatHandler(targetUserReference, accessToken)
        .then((responseChat: IDirectChat) => {
          router.push('/direct?reference=' + responseChat.reference, { scroll: false });
        })
        .catch((error) => {
          void getDirectChatBetweenUsersHandler(targetUserReference, accessToken).then(
            (responseChat: IDirectChat) => {
              router.push('/direct?reference=' + responseChat.reference, { scroll: false });
            },
          );
          console.error(`createDirectChatHandler failed: ${error}`);
        });
    });
  };

  return (
    <>
      <div
        className="p-2 bg-blue-500 text-white rounded cursor-pointer drop-shadow"
        onClick={() => createDirectChat()}
      >
        Написать сообщение
      </div>
    </>
  );
};
