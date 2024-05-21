import { INotification } from '@/entities/Notification/types';
import Image from 'next/image';

interface IProps {
  notification: INotification;
}

export const NotificationMediaBody = ({ notification }: IProps) => {
  return (
    <div className="grid justify-center gap-3 p-2 items-center">
      {notification.body?.body.text && (
        <span className="text-sm">{notification.body?.body.text}</span>
      )}
      {notification.body?.body.image_url && (
        <Image
          src={notification.body?.body.image_url}
          alt=""
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: '100%', maxHeight: '200px' }}
          className="rounded-3xl cursor-pointer"
        />
      )}
      {notification.body.body.video_url && (
        <div className="flex justify-center w-full h-[100%] max-h-[200px]">
          <video src={notification.body.body.video_url} controls className="rounded-3xl" />
        </div>
      )}
    </div>
  );
};
