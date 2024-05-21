import classNames from 'classnames';
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from 'react';

import { ToolGroup, ToolManager } from '@/_pages/Customizator/types';

type PropTypes = {
  item: ToolGroup;
  toolManager: ToolManager;
  onClick?: (e?: MouseEvent<HTMLDivElement>) => void;
  setIsSubMenuShown: Dispatch<SetStateAction<boolean>>;
};

export const ToolbarItemGroup = ({ item, toolManager, setIsSubMenuShown, onClick }: PropTypes) => {
  const [selectedGroupTool, setSelectedGroupTool] = useState(item.tools[0]);
  const selectedTool =
    toolManager.selectedTool.type === 'tool' ? toolManager.selectedTool : undefined;

  useEffect(() => {
    if (selectedTool && item.tools.includes(selectedTool)) {
      setSelectedGroupTool(selectedTool);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolManager.selectedTool]);

  return (
    <div className="relative h-10 w-10 flex flex-row items-center rounded-md">
      <div
        className={classNames(
          'h-8 w-8 flex items-center justify-center rounded-full',
          toolManager.selectedTool?.id === selectedGroupTool.id
            ? 'bg-[#00A3FF]'
            : 'hover:bg-[#00A3FF]/50',
        )}
        onClick={(e: MouseEvent<HTMLDivElement>) => {
          if (selectedGroupTool?.id === toolManager.selectedTool.id) {
            onClick?.(e);
            setIsSubMenuShown((isShown) => !isShown);
          } else {
            if (selectedGroupTool) {
              toolManager.setSelectedTool(selectedGroupTool);
              toolManager.setSelectedToolGroup(item);
              setIsSubMenuShown(false);
            }
          }
        }}
      >
        {selectedGroupTool?.icon?.(selectedGroupTool.id === toolManager.selectedTool.id)}
        <div className="absolute right-1 bottom-1 border-r-0 border-b-[7px] border-b-[#000] border-l-transparent border-l-[7px]" />
      </div>
    </div>
  );
};
