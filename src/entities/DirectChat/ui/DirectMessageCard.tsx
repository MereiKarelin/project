import 'moment/locale/ru';

import classNames from 'classnames';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';

import { IDirectMessage } from '@/entities/DirectChat/types';
import { CheckMark, DoubleCheckMarkIcon } from '@/shared/assets/icons';
import { useAppSelector } from '@/shared/store/hooks';
import { userSelector } from '@/shared/store/selectors/user';
import { consoleLog } from '@/shared/utils';

interface IProps {
  message: IDirectMessage;
  isConfirmed: boolean;
  openPopupImage: (image: string) => void;
}

export const DirectMessageCard = ({ message, isConfirmed, openPopupImage }: IProps) => {
  const [isOwnMessage, seyIsOwnMessage] = useState(false);
  const userInfo = useAppSelector(userSelector);

  useEffect(() => {
    if (message.user_reference === userInfo?.reference) {
      seyIsOwnMessage(true);
    } else {
      seyIsOwnMessage(false);
    }
  }, [message, userInfo]);

  const [currentMessageStatus, setCurrentMessageStatus] = useState<'sending' | 'read' | 'sent'>();

  useEffect(() => {
    consoleLog('updateMessageStatus');
    consoleLog(message);
    if (message.isSending) {
      setCurrentMessageStatus('sending');
    } else if (!message.read_at) {
      setCurrentMessageStatus('sent');
    } else {
      setCurrentMessageStatus('read');
    }
  }, [message]);

  return (
    <div className={classNames('grid', isOwnMessage ? 'justify-end' : 'justify-start')}>
      <div
        className={classNames(
          'max-w-[380px] grid gap-0 rounded-2xl p-2 min-h-[40px]',
          isOwnMessage ? 'bg-[#ECFFF0] rounded-br-none' : 'bg-[#E1F3FF] rounded-bl-none',
        )}
      >
        <div>
          {message.images?.map((image, index) => (
            <img
              src={image}
              key={index}
              alt="image"
              className="w-30 h-30 rounded-xl cursor-pointer"
              onClick={() => openPopupImage(image)}
            />
          ))}
        </div>
        <span
          className={classNames(
            'text-black flex self-start',
            isOwnMessage ? 'pl-3 pr-4' : 'pl-3 pr-3',
          )}
          style={{ wordBreak: 'break-word' }}
        >
          {message.text}
        </span>
        <span
          className={classNames(
            'flex justify-end gap-1 items-center text-[12px] pl-2 pr-2',
            isOwnMessage ? 'text-[#00CF08]' : 'text-[#0099FF]',
          )}
        >
          {moment(message.created_at).locale('ru').format('HH:mm')}
          {isOwnMessage &&
            (currentMessageStatus == 'sending' ? (
              <div>Отправляется...</div>
            ) : currentMessageStatus == 'read' ? (
              <>
                <DoubleCheckMarkIcon fill={isOwnMessage ? '#00CF08' : '#0099FF'} width={12} />
              </>
            ) : (
              <>
                {isConfirmed && (
                  <CheckMark fill={isOwnMessage ? '#00CF08' : '#0099FF'} width={12} />
                )}
              </>
            ))}
        </span>
      </div>
    </div>
  );
};
