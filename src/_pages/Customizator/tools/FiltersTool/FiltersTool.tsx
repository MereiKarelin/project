import MoveableHelper from 'moveable-helper';
import { RefObject } from 'react';
import Moveable from 'react-moveable';

import { Viewport } from '@/_pages/Customizator/components';
import { FiltersIcon } from '@/_pages/Customizator/Icons';
import ColorBox from '@/_pages/Customizator/Inputs/ColorBox';
import TabInputBox from '@/_pages/Customizator/Inputs/TabInputBox';
import {
  convertCssStringToStyleObject,
  getId,
  getWidget,
  isWidgetId,
  setProperty,
} from '@/_pages/Customizator/utils';
import { getSelectedFrames } from '@/_pages/Customizator/utils/MoveableHelper';

import type {
  EventBus,
  HistoryManager,
  Tab,
  TargetsManager,
  ToolManager,
} from '@/_pages/Customizator/types';
type PropTypes = {
  targetsManager: TargetsManager;
  moveableHelper: MoveableHelper;
  viewportRef: RefObject<Viewport>;
  moveable: RefObject<Moveable>;
  toolManager: ToolManager;
  eventBus: EventBus;
  historyManager: HistoryManager;
};

const handleChangeBackgroundColor = (
  v: string,
  viewportRef: RefObject<Viewport>,
  moveable: RefObject<Moveable>,
  targetsManager: TargetsManager,
  toolManager: ToolManager,
  moveableHelper: MoveableHelper,
  eventBus: EventBus,
  historyManager: HistoryManager,
) => {
  toolManager.toolProperties.set('background-color', v);
  setProperty(
    ['background-color'],
    v,
    viewportRef,
    moveable,
    targetsManager,
    moveableHelper,
    eventBus,
    historyManager,
  );
};

const handleChangeTextColor = (
  v: string,
  viewportRef: RefObject<Viewport>,
  moveable: RefObject<Moveable>,
  targetsManager: TargetsManager,
  toolManager: ToolManager,
  moveableHelper: MoveableHelper,
  eventBus: EventBus,
  historyManager: HistoryManager,
) => {
  toolManager.toolProperties.set('color', v);
  setProperty(
    ['color'],
    v,
    viewportRef,
    moveable,
    targetsManager,
    moveableHelper,
    eventBus,
    historyManager,
  );
};

export const FiltersTool: Tab = {
  id: 'Color',
  type: 'tab',
  title: 'color',
  icon: (selected) => (selected ? <FiltersIcon stroke="#fff" fill="#fff" /> : <FiltersIcon />),
  subMenuWidth: 200,
  Component: ({
    targetsManager,
    moveableHelper,
    viewportRef,
    moveable,
    toolManager,
    eventBus,
    historyManager,
  }: PropTypes) => {
    const frames = getSelectedFrames(targetsManager.selectedTargets, moveableHelper);
    if (!frames?.length) return;

    const target = targetsManager.selectedTargets?.[0] as HTMLElement;
    const id = getId(target);
    if (!id) return;

    const style = convertCssStringToStyleObject(target.style.cssText);
    let widget = undefined;
    if (isWidgetId(id)) {
      widget = getWidget(target);
    }

    const backgroundColor =
      style?.backgroundColor ?? widget?.style.backgroundColor ?? 'transparent';
    const color = style?.color ?? widget?.style.color ?? '#333';

    return (
      <div className="flex flex-col gap-1 text-black">
        <TabInputBox
          label="Background Color"
          input={ColorBox}
          value={backgroundColor}
          updateValue={true}
          onChange={(value) =>
            handleChangeBackgroundColor(
              value,
              viewportRef,
              moveable,
              targetsManager,
              toolManager,
              moveableHelper,
              eventBus,
              historyManager,
            )
          }
        />
        <TabInputBox
          label="Text Color"
          input={ColorBox}
          value={color}
          updateValue={true}
          onChange={(value) =>
            handleChangeTextColor(
              value,
              viewportRef,
              moveable,
              targetsManager,
              toolManager,
              moveableHelper,
              eventBus,
              historyManager,
            )
          }
        />
      </div>
    );
  },
};
