import { UserReactionStructure } from '@/entities/Post/model/types';
import ReactionCard from '@/shared/ui/ReactionCard/ReactionCard';

type PropTypes = {
  reactions: UserReactionStructure[] | undefined;
  handleReactionClick: (reaction: UserReactionStructure) => void;
  isNoPreview?: boolean;
  className?: string;
  prefix?: string;
};

const PostReactions = ({
  reactions,
  className = 'flex flex-row gap-3 h-auto flex-wrap',
  isNoPreview = false,
  handleReactionClick,
  prefix = '',
}: PropTypes) => {
  if (!reactions?.length) return null;

  return (
    <div className={className}>
      {reactions.map((reaction) => (
        <div key={reaction.created_at}>
          <ReactionCard
            reaction={reaction}
            iconHeight="24"
            isNoPreview={isNoPreview}
            className="rounded-2xl min-w-[36px] items-center text-xs"
            prefix={prefix}
            handleClick={() => handleReactionClick?.(reaction)}
          />
        </div>
      ))}
    </div>
  );
};

export default PostReactions;
