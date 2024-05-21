import MoveableHelper from 'moveable-helper';
import { RefObject } from 'react';
import Moveable from 'react-moveable';
import Selecto, { Rect } from 'react-selecto';

import { Viewport } from '@/widgets/Customizator/Editor/components';
import {
  EventBus,
  HistoryManager,
  TargetsManager,
  ToolManager,
  ViewportManager,
} from '@/widgets/Customizator/Editor/types';
import { appendJSXs } from '@/widgets/Customizator/Editor/utils';

import { setSelectedTargets } from '../utils/MoveableHelper';

export const selectEndHandlerMove = (
  _rect: Rect,
  _viewportRef: RefObject<Viewport>,
  selecto: RefObject<Selecto>,
  targetsManager: TargetsManager,
  _viewportManager: ViewportManager,
  _toolManager: ToolManager,
  _moveableHelper: MoveableHelper,
  eventBus: EventBus,
  historyManager: HistoryManager,
  selected: (HTMLElement | SVGElement)[],
  isDragStart: boolean,
  inputEvent: any,
  moveable: RefObject<Moveable<object>>,
) => {
  setSelectedTargets(selected, targetsManager, historyManager, selecto, eventBus);
  if (!isDragStart) {
    return;
  }
  moveable.current?.dragStart(inputEvent);
};

export const selectEndHandler = (
  rect: Rect,
  viewportRef: RefObject<Viewport>,
  selecto: RefObject<Selecto>,
  targetsManager: TargetsManager,
  viewportManager: ViewportManager,
  toolManager: ToolManager,
  moveableHelper: MoveableHelper,
  eventBus: EventBus,
  historyManager: HistoryManager,
  selected: (HTMLElement | SVGElement)[],
  isDragStart: boolean,
  inputEvent: any,
  moveable: RefObject<Moveable<object>>,
) => {
  const zoom = viewportManager.viewportState.zoom;
  const selectedTool = toolManager.selectedTool;
  const width = rect.width;
  const height = rect.height;

  if (!selectedTool || !selectedTool.elementProperties || !width || !height) {
    setSelectedTargets(selected, targetsManager, historyManager, selecto, eventBus);
    if (!isDragStart) {
      return;
    }
    moveable.current?.dragStart(inputEvent);

    return;
  }

  const divElementProperties = selectedTool.elementProperties(toolManager.toolProperties);

  const top =
    rect.top - (viewportRef.current?.viewportRef.current?.getBoundingClientRect().top ?? 0);
  const left =
    rect.left - (viewportRef.current?.viewportRef.current?.getBoundingClientRect().left ?? 0);

  const style = {
    top: `${top / zoom}px`,
    left: `${left / zoom}px`,
    position: 'absolute',
    width: `${width / zoom}px`,
    height: `${height / zoom}px`,
    ...divElementProperties.style,
  };

  appendJSXs(
    [
      {
        jsx: 'div',
        attrs: divElementProperties.attrs,
        name: selectedTool.id,
        frame: style,
      },
    ],
    viewportRef,
    moveableHelper,
    targetsManager,
    historyManager,
    selecto,
    eventBus,
  )
    ?.then((target) => target[0].focus())
    .catch((error) => {
      console.error(`appending JSX failed: ${error}`);
    });
};
