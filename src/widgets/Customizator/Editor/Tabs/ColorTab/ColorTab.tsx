import MoveableHelper from 'moveable-helper';
import { RefObject } from 'react';
import Moveable from 'react-moveable';

import { Viewport } from '@/widgets/Customizator/Editor/components';
import { ColorIcon } from '@/widgets/Customizator/Editor/Icons/ColorIcon';
import ColorBox from '@/widgets/Customizator/Editor/Inputs/ColorBox';
import TabInputBox from '@/widgets/Customizator/Editor/Inputs/TabInputBox';
import {
  EventBus,
  HistoryManager,
  TargetsManager,
  Tool,
  ToolManager,
} from '@/widgets/Customizator/Editor/types';
import { prefix, setProperty } from '@/widgets/Customizator/Editor/utils';
import { getSelectedFrames } from '@/widgets/Customizator/Editor/utils/MoveableHelper';

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

type PropTypes = {
  targetsManager: TargetsManager;
  moveableHelper: MoveableHelper;
  viewportRef: RefObject<Viewport>;
  moveable: RefObject<Moveable>;
  toolManager: ToolManager;
  eventBus: EventBus;
  historyManager: HistoryManager;
};

export const ColorTab: Tool = {
  id: 'Color',
  type: 'tab',
  icon: () => <ColorIcon />,
  title: 'Color',
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

    let backgroundColor = toolManager.toolProperties.get('background-color');
    let color = toolManager.toolProperties.get('color');

    const backgroundColors = frames.map((frame) => frame.get('background-color'));
    const colors = frames.map((frame) => frame.get('color'));

    backgroundColor = backgroundColors.filter((color) => color)[0] || 'transparent';
    color = colors.filter((color) => color)[0] || '#333';

    return (
      <div className={prefix('current-tab')}>
        <TabInputBox
          type={'full'}
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
          type={'full'}
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
