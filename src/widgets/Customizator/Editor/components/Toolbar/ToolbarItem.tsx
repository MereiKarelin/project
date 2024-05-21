import type { Tool } from '@/widgets/Customizator/Editor/types';
import classNames from 'classnames';
import { MouseEvent } from 'react';

type PropTypes = {
  item: Tool;
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
  onClick?: (e?: MouseEvent<HTMLDivElement>) => void;
};
export const ToolbarItem = ({ item, selectedTool, setSelectedTool, onClick }: PropTypes) => (
  <div
    className={classNames(
      'relative p-1 rounded-sm',
      item.id === selectedTool?.id && 'bg-[#44aaff]',
    )}
    onClick={(e) => {
      e.stopPropagation();
      if (item.id !== selectedTool?.id) {
        setSelectedTool(item);
      }
      onClick?.(e);
    }}
  >
    {item.icon?.(item.id === selectedTool?.id)}
  </div>
);
