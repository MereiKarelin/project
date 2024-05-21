import { RelationCard } from '@/entities/Relations/ui/RelationCard';
import { IPublicUser } from '@/entities/User';
import ReactIntersectionObserver from '@/shared/ui/ReactIntersectionObserver';

interface IProps {
  name: string;
  list: IPublicUser[];
  listCount: number;
  hasMore: boolean;
  isLoading: boolean;
  loadNext: () => void;
  alternativeContent?: string;
}

export const RelationsList = ({
  list,
  listCount,
  hasMore,
  isLoading,
  loadNext,
  name,
  alternativeContent,
}: IProps) => {
  return (
    <div className="grid w-full content-start">
      <strong className="text-2xl">
        {name} ({listCount})
      </strong>
      <div className="overflow-y-auto">
        <ReactIntersectionObserver hasMore={hasMore} isLoading={isLoading} loadNext={loadNext}>
          {list.length ? (
            <div className="w-full grid gap-3">
              {list.map((user, index) => (
                <RelationCard key={index} user={user} />
              ))}
            </div>
          ) : !isLoading ? (
            <span className="text-2xl font-semibold">{alternativeContent}</span>
          ) : null}
        </ReactIntersectionObserver>
      </div>
    </div>
  );
};
