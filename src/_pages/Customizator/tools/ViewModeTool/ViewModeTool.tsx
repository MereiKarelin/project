import { Dispatch, SetStateAction } from 'react';

import { viewModes } from '@/_pages/Customizator/consts';
import { FeedIcon } from '@/_pages/Customizator/Icons';
import { Button } from '@/shared/ui/ButtonNew';

import type { Tab, ViewMode } from '@/_pages/Customizator/types';
export const ViewModeTool: Tab = {
  id: 'ViewMode',
  type: 'tab',
  title: 'Вид просмотра',
  icon: (selected?: boolean) => <FeedIcon stroke={selected ? '#fff' : '#555'} />,
  Component: ({
    viewMode,
    setViewMode,
  }: {
    viewMode?: ViewMode;
    setViewMode?: Dispatch<SetStateAction<ViewMode>>;
  }) => {
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
              setViewMode?.(mode.id);
            }}
          >
            {mode.name}
          </Button>
        ))}
      </div>
    );
  },
  subMenuWidth: 150,
};
