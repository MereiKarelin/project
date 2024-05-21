import { IPublicUser } from '@/entities/User';
import { UserCard } from '@/entities/User/ui/UserCard';
import RelationButtons from '@/widgets/RelationButtons/ui/RelationButtons';

interface IProps {
  user: IPublicUser;
}

export const RelationCard = ({ user }: IProps) => {
  return (
    <div className="flex bg-white justify-between p-2 rounded drop-shadow">
      <UserCard user={user} />
      <RelationButtons user={user} />
    </div>
  );
};
