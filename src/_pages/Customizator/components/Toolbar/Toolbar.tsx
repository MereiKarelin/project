import { Dispatch, MouseEvent, SetStateAction, useEffect } from 'react';

import { ToolbarItem } from '@/_pages/Customizator/components/Toolbar/ToolbarItem';
import {
  MobileToolGroup,
  ShapesToolGroup,
  ToolsDesktop,
  ToolsMobile,
  ToolsTablet,
} from '@/_pages/Customizator/consts';
import { Direction } from '@/shared/types';
import { Button } from '@/shared/ui/ButtonNew';
import { getSubMenuPosition } from '@/shared/utils';

import type {
  EditorType,
  ToolManager,
  ToolbarItem as ToolbarItemType,
} from '@/_pages/Customizator/types';

type PropTypes = {
  editorType: EditorType;
  setIsSubMenuShown: Dispatch<SetStateAction<boolean>>;
  toolManager: ToolManager;
  handleSaveClick: () => void;
  setSubMenuPosition: Dispatch<
    SetStateAction<{
      offset: { [key in Direction]?: number };
      position: Direction;
    }>
  >;
  isVisible: boolean;
};

export const Toolbar = ({
  editorType,
  setIsSubMenuShown,
  toolManager,
  handleSaveClick,
  setSubMenuPosition,
  isVisible,
}: PropTypes) => {
  useEffect(() => {
    function updateToolGroup() {
      if (window.innerWidth < 640) {
        toolManager.setSelectedToolGroup(MobileToolGroup);
      } else {
        toolManager.setSelectedToolGroup(ShapesToolGroup);
      }
    }
    window.addEventListener('resize', updateToolGroup);
    updateToolGroup();
    return () => window.removeEventListener('resize', updateToolGroup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isVisible) return null;

  const updateSubMenuPosition = (
    e: MouseEvent<HTMLDivElement>,
    submenuWidth: number,
    offset: { [key in Direction]?: number } = { left: 0, right: 0, top: 0, bottom: 0 },
  ) => {
    const boundingRect = e.currentTarget.getBoundingClientRect();
    setSubMenuPosition(() => getSubMenuPosition(boundingRect, submenuWidth, offset));
  };

  const onToolbarClick = (e: MouseEvent<HTMLDivElement> | undefined, tool: ToolbarItemType) => {
    if (tool.type === 'toolGroup' && e) {
      updateSubMenuPosition(e, tool.subMenuWidth, { bottom: 56 });
    }
    if (tool.type === 'tab' && e) {
      updateSubMenuPosition(e, tool.subMenuWidth, { bottom: 56 });
    }
  };

  return (
    <div
      className="flex flex-row gap-3 bg-white w-full xs:w-[500px] sm:w-[570px] lg:w-[620px] h-14 rounded-full px-2 xs:px-6 items-center justify-between z-10 "
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="hidden lg:flex flex-row gap-[10px] items-center justify-center">
        {ToolsDesktop.map((tool) => (
          <ToolbarItem
            key={tool.id}
            item={tool}
            toolManager={toolManager}
            setIsSubMenuShown={setIsSubMenuShown}
            onClick={(e) => onToolbarClick(e, tool)}
          />
        ))}
      </div>

      <div className="hidden sm:flex lg:hidden flex-row gap-[10px] items-center justify-center">
        {ToolsTablet.map((tool) => (
          <ToolbarItem
            key={tool.id}
            item={tool}
            toolManager={toolManager}
            setIsSubMenuShown={setIsSubMenuShown}
            onClick={(e) => onToolbarClick(e, tool)}
          />
        ))}
      </div>

      <div className="flex sm:hidden flex-row gap-1 xs:gap-2 items-center justify-center">
        {ToolsMobile.map((tool) => (
          <ToolbarItem
            key={tool.id}
            item={tool}
            toolManager={toolManager}
            setIsSubMenuShown={setIsSubMenuShown}
            onClick={(e) => onToolbarClick(e, tool)}
          />
        ))}
      </div>

      <div className="hidden sm:block">
        <Button size="s" textColor="secondary" onClick={handleSaveClick}>
          {editorType === 'post' ? 'Опубликовать' : 'Сохранить'}
        </Button>
      </div>

      <div className="block sm:hidden">
        <Button size="xs" textColor="secondary" onClick={handleSaveClick}>
          {editorType === 'post' ? 'Опубликовать' : 'Сохранить'}
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
