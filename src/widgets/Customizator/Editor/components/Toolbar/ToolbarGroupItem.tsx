import type { Tool, ToolGroup, ToolManager } from '@/widgets/Customizator/Editor/types';
import classNames from 'classnames';
import { MouseEvent, useEffect } from 'react';

type PropTypes = {
  item: ToolGroup;
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
  toolManager: ToolManager;
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
};
export const ToolbarGroupItem = ({
  item,
  selectedTool,
  setSelectedTool,
  toolManager,
  onClick,
}: PropTypes) => {
  useEffect(() => {
    if (item.tools.map((tool) => tool.id).includes(selectedTool.id)) {
      toolManager.setSelectedGroupTool(selectedTool);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTool, item]);

  return (
    <div
      className={classNames(
        'relative p-1 rounded-sm',
        toolManager.selectedGroupTool?.id === selectedTool?.id && 'bg-[#44aaff]',
      )}
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (toolManager.selectedGroupTool?.id === selectedTool.id) {
          //click on selected tool, to select new tool from group
          onClick(e);
        } else {
          if (toolManager.selectedGroupTool) {
            setSelectedTool(toolManager.selectedGroupTool);
          }
        }
      }}
    >
      {toolManager.selectedGroupTool?.icon()}
      <div className="absolute right-1 bottom-1 border-r-0 border-b-[7px] border-b-[#fff] border-l-transparent border-l-[7px]" />
    </div>
  );
};
