import { Button } from '@/shared/ui/ButtonNew';
import { viewModes } from '@/widgets/Customizator/EditorNew/consts';
import { FeedIcon } from '@/widgets/Customizator/EditorNew/uis/icons';

import type { Tool } from '@/widgets/Customizator/EditorNew/types';
export const FeedTool: Tool = {
  id: 'feed',
  name: 'feed',
  icon: () => <FeedIcon stroke="#fff" />,
  className: 'text-white p-1 rounded-3xl',
  submenuJSX: ({ viewMode, setViewMode }) => {
    return (
      <div className="flex flex-col 2xl:flex-row gap-3">
        {viewModes.map((mode) => (
          <Button
            key={mode.id}
            textColor="secondary"
            color={viewMode !== mode.id ? 'disabled' : 'primary'}
            size="s"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode(mode.id);
            }}
          >
            {mode.name}
          </Button>
        ))}
      </div>
    );
  },
  submenuWidth: 173,
};
