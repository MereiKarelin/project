import MoveableHelper from 'moveable-helper';
import { RefObject, useState } from 'react';
import Moveable from 'react-moveable';
import Selecto from 'react-selecto';

import { ToolbarItem, Viewport } from '@/widgets/Customizator/Editor/components';
import {
  AlignTab,
  ColorTab,
  FontTab,
  ImageTab,
  LayerTab,
  SaveTab,
} from '@/widgets/Customizator/Editor/Tabs';

import type {
  EditorType,
  EventBus,
  HistoryManager,
  TargetsManager,
  Tool,
  ToolManager,
} from '@/widgets/Customizator/Editor/types';

// const TABS: Tab[] = [ColorTab, AlignTab, FontTab, LayerTab, SaveTab, ImageTab];
const Tools: Tool[] = [ColorTab, AlignTab, FontTab, LayerTab, SaveTab, ImageTab];

type PropTypes = {
  editorType: EditorType;
  targetsManager: TargetsManager;
  moveableHelper: MoveableHelper;
  viewportRef: RefObject<Viewport>;
  moveable: RefObject<Moveable>;
  toolManager: ToolManager;
  eventBus: EventBus;
  historyManager: HistoryManager;
  selecto: RefObject<Selecto>;
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
};

export const Tabs = ({
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
  const [subMenuPosition, setSubMenuPosition] = useState<{ top: number; right: number }>({
    top: 0,
    right: 50,
  });

  return (
    <>
      <div className="absolute right-0 top-0 w-12 h-full p-2 flex flex-col justify-between bg-[#2a2a2a] z-10">
        <div className="flex flex-col gap-1">
          {Tools.map((item) => (
            <div key={item.id}>
              {!['tool', 'tab'].includes(item.type) ? null : (
                <ToolbarItem
                  item={item}
                  selectedTool={selectedTool}
                  setSelectedTool={setSelectedTool}
                  onClick={(e) => {
                    selectedTool.onClick?.(historyManager);
                    if (item.type === 'tab' && selectedTool.id !== item.id) {
                      setIsShowSubMenu(true);
                    } else {
                      setIsShowSubMenu(!isShowSubMenu);
                    }

                    const top = e?.currentTarget.getBoundingClientRect().top;
                    if (!top) return;
                    setSubMenuPosition((state) => ({
                      ...state,
                      top: top,
                    }));
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {isShowSubMenu && selectedTool.Component && (
        <div
          className="absolute z-10 w-52 bg-[#2a2a2a] p-2 text-white"
          style={{ top: `${subMenuPosition.top}px`, right: `${subMenuPosition.right}px` }}
        >
          <h2 className="text-sm font-bold">{selectedTool.title}</h2>
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
    </>
  );
};
