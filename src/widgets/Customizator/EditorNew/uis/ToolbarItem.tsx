'use client';
import classNames from 'classnames';
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from 'react';

import { toolGroupIds } from '@/widgets/Customizator/EditorNew/consts';

import type { Tool, ToolGroup, ToolId } from '@/widgets/Customizator/EditorNew/types';
type PropTypes = {
  item: Tool | ToolGroup;
  selectedTool: Tool | undefined;
  setSelectedTool: Dispatch<SetStateAction<Tool | undefined>>;
  setSelectedGroup: Dispatch<SetStateAction<ToolGroup | undefined>>;
  subMenuShown: boolean;
  setSubMenuShown: (state: boolean) => void;
  updateSubMenuPosition: (e: MouseEvent<HTMLDivElement>, submenuWidth: number) => void;
};

export const ToolbarItem = ({
  item,
  selectedTool,
  setSelectedTool,
  setSelectedGroup,
  subMenuShown,
  setSubMenuShown,
  updateSubMenuPosition,
}: PropTypes) => {
  const [tool, setTool] = useState<Tool>(item as Tool);
  const [toolGroup, setToolGroup] = useState<ToolGroup>(item as ToolGroup);
  const [groupTool, setGroupTool] = useState<Tool>();

  useEffect(() => {
    if (toolGroupIds.includes(item.id)) {
      const group = item as ToolGroup;
      setToolGroup(group);
      if (!groupTool) {
        const firstTool = Object.keys(group.group)[0] as ToolId;
        setGroupTool(toolGroup.group[firstTool]);
      } else if (selectedTool) {
        const toolIds = Object.values(toolGroup.group).map((tool) => tool.id);
        if (toolIds.includes(selectedTool.id)) {
          setGroupTool(selectedTool);
        }
      }
    } else {
      setTool(item as Tool);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, selectedTool]);

  if (groupTool) {
    return (
      <div className="relative h-10 w-10 flex flex-row items-center hover:bg-slate-200 rounded-md">
        <div
          className={classNames(
            'h-8 w-8 flex items-center justify-center',
            groupTool.className,
            (selectedTool as Tool)?.name === groupTool.name &&
              (selectedTool as Tool)?.name !== 'feed' &&
              'bg-[#00A3FF]',
            groupTool.name === 'feed' && 'bg-[#78E378]',
          )}
          onClick={(e) => {
            if (selectedTool?.id !== groupTool.id) {
              setSelectedTool(() => ({ ...groupTool }));
              setSelectedGroup(toolGroup);
              setSubMenuShown(false);
            } else {
              setSubMenuShown(!subMenuShown);
            }
            updateSubMenuPosition(e, groupTool.submenuWidth ?? 0);
          }}
        >
          {groupTool.icon?.((selectedTool as Tool)?.name === groupTool.name)}
          <div className="absolute right-1 bottom-1 border-r-0 border-b-[7px] border-b-[#000] border-l-transparent border-l-[7px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center hover:bg-slate-200 rounded-md">
      <div
        className={classNames(
          tool.className,
          (selectedTool as Tool)?.name === tool.name &&
            (selectedTool as Tool)?.name !== 'feed' &&
            'bg-[#00A3FF]',
          tool.name === 'feed' && 'bg-[#78E378]',
        )}
        onClick={(e) => {
          if (selectedTool?.id !== tool.id) {
            setSelectedTool(() => ({ ...tool }));
            setSelectedGroup(undefined);
            setSubMenuShown(false);
          } else {
            setSubMenuShown(!subMenuShown);
          }
          updateSubMenuPosition(e, tool.submenuWidth ?? 0);
        }}
      >
        {tool.icon?.((selectedTool as Tool)?.name === tool.name)}
      </div>
    </div>
  );
};
