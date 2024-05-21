import { INotification } from '@/entities/Notification/types';

interface IProps {
  notification: INotification;
}

export const NotificationCard = ({ notification }: IProps) => {
  return (
    <div>
      <div style={{ wordBreak: 'break-word' }}>{notification.type}</div>
      {notification.read_at}
    </div>
  );
};
