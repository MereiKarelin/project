import MoveableHelper from 'moveable-helper';
import { MouseEvent, RefObject, useState } from 'react';
import Moveable from 'react-moveable';
import Selecto from 'react-selecto';

import { ToolbarGroupItem, ToolbarItem, Viewport } from '@/widgets/Customizator/Editor/components';
import { ToolbarItems } from '@/widgets/Customizator/Editor/consts';

import type {
  EditorType,
  EventBus,
  HistoryManager,
  TargetsManager,
  Tool,
  ToolManager,
} from '@/widgets/Customizator/Editor/types';
type PropTypes = {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
  toolManager: ToolManager;
  historyManager: HistoryManager;
  editorType: EditorType;
  targetsManager: TargetsManager;
  moveableHelper: MoveableHelper;
  viewportRef: RefObject<Viewport>;
  moveable: RefObject<Moveable>;
  eventBus: EventBus;
  selecto: RefObject<Selecto>;
};

export const Toolbar = ({
  selectedTool,
  setSelectedTool,
  editorType,
  targetsManager,
  moveableHelper,
  viewportRef,
  moveable,
  toolManager,
  eventBus,
  historyManager,
  selecto,
}: PropTypes) => {
  const [isShowSubMenu, setIsShowSubMenu] = useState(false);
  const [subMenuPosition, setSubMenuPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 50,
  });

  return (
    <div className="absolute left-0 top-0 w-12 h-full p-2 flex flex-col justify-between bg-[#2a2a2a] z-10">
      <div className="flex flex-col gap-1">
        {ToolbarItems.map((item) => (
          <div key={item.id}>
            <>
              {item.type !== 'toolGroup' ? null : (
                <ToolbarGroupItem
                  item={item}
                  selectedTool={selectedTool}
                  setSelectedTool={setSelectedTool}
                  toolManager={toolManager}
                  onClick={(e: MouseEvent<HTMLDivElement>) => {
                    const top = e.currentTarget.getBoundingClientRect().top;
                    setSubMenuPosition((state) => ({
                      ...state,
                      top,
                    }));
                    setIsShowSubMenu(!isShowSubMenu);
                  }}
                />
              )}
              {item.type !== 'tool' ? null : (
                <ToolbarItem
                  item={item}
                  selectedTool={selectedTool}
                  setSelectedTool={setSelectedTool}
                  onClick={() => selectedTool.onClick?.(historyManager)}
                />
              )}
            </>
          </div>
        ))}
      </div>
      {isShowSubMenu && selectedTool.Component && (
        <div
          className="absolute z-10"
          style={{ top: `${subMenuPosition.top}px`, left: `${subMenuPosition.left}px` }}
        >
          <selectedTool.Component
            editorType={editorType}
            targetsManager={targetsManager}
            moveableHelper={moveableHelper}
            viewportRef={viewportRef}
            moveable={moveable}
            toolManager={toolManager}
            eventBus={eventBus}
            historyManager={historyManager}
            selecto={selecto}
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
          />
        </div>
      )}
    </div>
  );
};
