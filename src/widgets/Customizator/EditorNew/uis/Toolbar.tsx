import classNames from 'classnames';
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from 'react';

import { Button } from '@/shared/ui/ButtonNew';
import { toolsDesktop, toolsMobile } from '@/widgets/Customizator/EditorNew/consts';
import {
  CircleTool,
  FiltersTool,
  GalleryUploadTool,
  TextTool,
} from '@/widgets/Customizator/EditorNew/tools';
import { KeyboardShortcuts } from '@/widgets/Customizator/EditorNew/uis/KeyboardShortcuts';
import { ToolbarItem } from '@/widgets/Customizator/EditorNew/uis/ToolbarItem';
import { getSubMenuPosition } from '@/widgets/Customizator/EditorNew/utils';

import type { Tool, ToolGroup, ToolId, ViewMode } from '@/widgets/Customizator/EditorNew/types';
type PropTypes = {
  viewMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
};

const Toolbar = ({ viewMode, setViewMode }: PropTypes) => {
  const [selectedTool, setSelectedTool] = useState<Tool>();
  const [selectedGroup, setSelectedGroup] = useState<ToolGroup>();
  const [subMenuShown, setSubMenuShown] = useState(false);
  const [subMenuPosition, setSubMenuPosition] = useState<{
    offset: number;
    direction: number;
  }>({
    offset: 0,
    direction: 0,
  });
  const [keyboardShortcutsShown, setKeyboardShortcutsShown] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      e.stopPropagation();

      const key = e.code;
      if (key === 'Slash') setKeyboardShortcutsShown((shown) => !shown);
      if (key === 'Escape') setKeyboardShortcutsShown(false);
    };

    document.addEventListener('keydown', handleKeyDown);

    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const updateSubMenuPosition = (e: MouseEvent<HTMLDivElement>, submenuWidth: number) => {
    const boundingRect = e.currentTarget.getBoundingClientRect();
    setSubMenuPosition(() => getSubMenuPosition(boundingRect, submenuWidth));
  };

  const handleClick = (e: any, toolId: ToolId) => {
    e.stopPropagation();

    if (toolId === 'text') setSelectedTool(TextTool);
    if (toolId === 'galleryUpload') setSelectedTool(GalleryUploadTool);
    if (toolId === 'circle') setSelectedTool(CircleTool);
    if (toolId === 'filters') setSelectedTool(FiltersTool);
  };

  return (
    <div className="flex flex-row gap-3 bg-white w-full h-14 rounded-full px-2 xs:px-6 items-center justify-between">
      <div className="hidden sm:flex flex-row gap-[10px]">
        {toolsDesktop.map((tool) => (
          <ToolbarItem
            key={tool.id}
            item={tool}
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            setSelectedGroup={setSelectedGroup}
            subMenuShown={subMenuShown}
            setSubMenuShown={setSubMenuShown}
            updateSubMenuPosition={updateSubMenuPosition}
          />
        ))}
      </div>

      <div className="flex sm:hidden flex-row gap-1 xs:gap-2">
        {toolsMobile.map((tool) => (
          <ToolbarItem
            key={tool.id}
            item={tool}
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            setSelectedGroup={setSelectedGroup}
            subMenuShown={subMenuShown}
            setSubMenuShown={setSubMenuShown}
            updateSubMenuPosition={updateSubMenuPosition}
          />
        ))}
      </div>

      <Button size="s" textColor="secondary">
        Сохранить
      </Button>

      {subMenuShown && !!selectedTool && (selectedGroup || selectedTool.submenuJSX) && (
        <div
          className={classNames(
            'absolute bottom-14 p-3 z-20 shadow-lg bg-white rounded-tl-3xl rounded-tr-3xl flex flex-col items-center',
            subMenuPosition.direction === 0 && 'rounded-bl-3xl rounded-br-3xl items-center',
            subMenuPosition.direction === -1 && 'rounded-bl-3xl',
            subMenuPosition.direction === 1 && 'rounded-br-3xl',
          )}
          onClick={(e) => {
            setSubMenuShown(false);
            e.stopPropagation();
          }}
          style={
            subMenuPosition.direction !== -1
              ? { left: `${subMenuPosition.offset}px` }
              : { right: `${subMenuPosition.offset}px` }
          }
        >
          {!selectedGroup ? (
            selectedTool.submenuJSX && (
              <selectedTool.submenuJSX
                onClick={handleClick}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            )
          ) : (
            <div className="flex flex-row items-center gap-2">
              {Object.values(selectedGroup.group).map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => setSelectedTool(tool)}
                  className="hover:bg-slate-200 p-1 rounded-md"
                >
                  {tool.icon?.()}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <KeyboardShortcuts
        isShown={keyboardShortcutsShown}
        handleClose={(isShown) => setKeyboardShortcutsShown(!isShown)}
      />
    </div>
  );
};

export default Toolbar;
