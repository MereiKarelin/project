'use client';
import classNames from 'classnames';
import { Dispatch, MouseEvent, SetStateAction } from 'react';

import { ToolbarItemGroup } from '@/_pages/Customizator/components/Toolbar/ToolbarItemGroup';

import type { ToolManager, ToolbarItem as ToolbarItemType } from '@/_pages/Customizator/types';
type PropTypes = {
  item: ToolbarItemType;
  toolManager: ToolManager;
  setIsSubMenuShown: Dispatch<SetStateAction<boolean>>;
  onClick?: (e?: MouseEvent<HTMLDivElement>) => void;
};

export const ToolbarItem = ({ item, toolManager, setIsSubMenuShown, onClick }: PropTypes) => {
  if (item.type === 'toolGroup') {
    return (
      <ToolbarItemGroup
        item={item}
        toolManager={toolManager}
        onClick={(e?: MouseEvent<HTMLDivElement>) => {
          onClick?.(e);
        }}
        setIsSubMenuShown={setIsSubMenuShown}
      />
    );
  }

  if (item.type === 'tool') {
    return (
      <div
        className={classNames(
          'flex flex-row items-center rounded-full h-8 w-8 p-1 justify-center',
          toolManager.selectedTool?.id === item.id ? 'bg-[#00A3FF]' : 'hover:bg-[#00A3FF]/50',
        )}
        onClick={() => {
          if (toolManager.selectedTool?.id !== item.id) {
            toolManager.setSelectedToolGroup(undefined);
            toolManager.setSelectedTool(() => ({ ...item }));
            setIsSubMenuShown(false);
          }
        }}
      >
        {item.icon?.(toolManager.selectedTool?.id === item.id)}
      </div>
    );
  }

  if (item.type === 'tab') {
    return (
      <div
        className={classNames(
          'flex flex-row items-center rounded-full h-8 w-8 p-1 justify-center ',
          item.id === 'ViewMode' && 'bg-[#78E378]',
          toolManager.selectedTool?.id === item.id && item.id !== 'ViewMode' && 'bg-[#00A3FF]',
          toolManager.selectedTool?.id !== item.id &&
            item.id !== 'ViewMode' &&
            'hover:bg-[#00A3FF]/50',
        )}
        onClick={(e?: MouseEvent<HTMLDivElement>) => {
          if (item.id !== toolManager.selectedTool.id) {
            toolManager.setSelectedTool(item);
            setIsSubMenuShown(true);
          } else {
            setIsSubMenuShown((prev) => !prev);
          }
          onClick?.(e);
        }}
      >
        {item.icon?.(toolManager.selectedTool?.id === item.id)}
      </div>
    );
  }

  return null;
};
