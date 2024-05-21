import MoveableHelper from 'moveable-helper';
import { RefObject, useEffect } from 'react';
import Moveable, { OnDragOrigin } from 'react-moveable';
import Selecto from 'react-selecto';

import { Viewport } from '@/widgets/Customizator/Editor/components';
import {
  DeleteButtonViewable,
  DimensionViewable,
} from '@/widgets/Customizator/Editor/components/Viewport/ables';
import { tools } from '@/widgets/Customizator/Editor/consts';
import { getContentElement, getId } from '@/widgets/Customizator/Editor/utils';
import { removeElements } from '@/widgets/Customizator/Editor/utils/MoveableHelper';
import {
  redoRender,
  redoRenders,
  undoRender,
  undoRenders,
} from '@/widgets/Customizator/Editor/utils/MoveableManager';

import type {
  EventBus,
  HistoryManager,
  TargetsManager,
  Tool,
  ToolManager,
} from '@/widgets/Customizator/Editor/types';
type PropTypes = {
  selectedTargets: Array<HTMLElement | SVGElement>;
  selectedMenu: Tool;
  verticalGuidelines: number[];
  horizontalGuidelines: number[];
  zoom: number;
  moveableHelper: MoveableHelper;
  moveable: RefObject<Moveable>;
  isShift: boolean;
  eventBus: EventBus;
  historyManager: HistoryManager;
  viewportRef: RefObject<Viewport>;
  targetsManager: TargetsManager;
  toolManager: ToolManager;
  selecto: RefObject<Selecto>;
  clipPath?: string;
};

const MoveableManager = ({
  selectedTargets,
  selectedMenu,
  verticalGuidelines,
  horizontalGuidelines,
  zoom,
  moveableHelper,
  moveable,
  isShift,
  eventBus,
  historyManager,
  viewportRef,
  selecto,
  targetsManager,
  toolManager,
  clipPath = 'rect',
}: PropTypes) => {
  useEffect(() => {
    historyManager.registerType(
      'render',
      (props: any) => undoRender(props, eventBus, moveable, viewportRef, moveableHelper),
      (props: any) => redoRender(props, eventBus, moveable, viewportRef, moveableHelper),
    );
    historyManager.registerType(
      'renders',
      (props: any) => undoRenders(props, eventBus, moveable, viewportRef, moveableHelper),
      (props: any) => redoRenders(props, eventBus, moveable, viewportRef, moveableHelper),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const elementGuidelines = [document.querySelector('.scena-viewport')];

  return (
    <Moveable
      ables={[DimensionViewable, DeleteButtonViewable]}
      props={{
        dimensionViewable: true,
        deleteButtonViewable: true,
        onClickDelete: () =>
          removeElements(
            targetsManager.selectedTargets,
            viewportRef,
            moveableHelper,
            targetsManager,
            historyManager,
            selecto,
            eventBus,
          ),
      }}
      ref={moveable}
      targets={selectedTargets}
      draggable={true}
      resizable={true}
      pinchable={['rotatable']}
      snapContainer={'scena-viewport-container'}
      renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
      bounds={{ left: 0, top: 0, right: 0, bottom: 0, position: 'css' }}
      zoom={1 / zoom}
      throttleResize={1}
      clippable={selectedMenu.id.startsWith('Crop')}
      passDragArea={selectedMenu.id.startsWith('Text')}
      checkInput={selectedMenu.id.startsWith('Text')}
      throttleDragRotate={isShift ? 45 : 0}
      keepRatio={selectedTargets.length > 1 ? true : isShift}
      rotatable={true}
      snappable={true}
      snapDirections={{ center: true, middle: true }}
      elementSnapDirections={{ center: true, middle: true }}
      snapGap={false}
      roundable={true}
      verticalGuidelines={verticalGuidelines}
      horizontalGuidelines={horizontalGuidelines}
      elementGuidelines={elementGuidelines as any}
      clipArea={true}
      clipVerticalGuidelines={[0, '50%', '100%']}
      clipHorizontalGuidelines={[0, '50%', '100%']}
      clipTargetBounds={false}
      onBeforeRenderStart={moveableHelper.onBeforeRenderStart}
      onBeforeRenderGroupStart={moveableHelper.onBeforeRenderGroupStart}
      onDragStart={moveableHelper.onDragStart}
      onDrag={moveableHelper.onDrag}
      onDragGroupStart={moveableHelper.onDragGroupStart}
      onDragGroup={moveableHelper.onDragGroup}
      onScaleStart={moveableHelper.onScaleStart}
      onScale={moveableHelper.onScale}
      onScaleGroupStart={moveableHelper.onScaleGroupStart}
      onScaleGroup={moveableHelper.onScaleGroup}
      onResizeStart={moveableHelper.onResizeStart}
      onResize={moveableHelper.onResize}
      onResizeGroupStart={moveableHelper.onResizeGroupStart}
      onResizeGroup={moveableHelper.onResizeGroup}
      onRotateStart={moveableHelper.onRotateStart}
      onRotate={moveableHelper.onRotate}
      onRotateGroupStart={moveableHelper.onRotateGroupStart}
      onRotateGroup={moveableHelper.onRotateGroup}
      defaultClipPath={clipPath}
      onClip={moveableHelper.onClip}
      onDragOriginStart={moveableHelper.onDragOriginStart}
      onDragOrigin={(e: OnDragOrigin) => {
        moveableHelper.onDragOrigin(e);
      }}
      onRound={(e) => {
        e.target.style.borderRadius = e.borderRadius;
      }}
      onClick={(e) => {
        //TODO: implement tool select for each kind of element
        const target = e.inputTarget as any;

        if (target.isContentEditable) {
          const textTool = tools['Text'];
          textTool && toolManager.setSelectedTool(textTool);

          const el = getContentElement(target);

          if (el) {
            el.focus();
          }
        } else {
          selecto.current?.clickTarget(e.inputEvent, e.inputTarget);
        }
      }}
      onClickGroup={(e) => {
        selecto.current?.clickTarget(e.inputEvent, e.inputTarget);
      }}
      onRenderStart={(e) => {
        e.datas.prevData = moveableHelper.getFrame(e.target).get();
      }}
      onRender={(e) => {
        e.datas.isRender = true;
        eventBus.requestTrigger('render');
      }}
      onRenderEnd={(e) => {
        eventBus.requestTrigger('render');

        if (!e.datas.isRender) {
          return;
        }

        const frame = moveableHelper.getFrame(e.target);
        frame.set({
          'border-radius': e.target.style.borderRadius,
        });

        historyManager.addAction('render', {
          id: getId(e.target),
          prev: e.datas.prevData,
          next: moveableHelper.getFrame(e.target).get(),
        });
      }}
      onRenderGroupStart={(e) => {
        e.datas.prevDatas = e.targets.map((target) => moveableHelper.getFrame(target).get());
      }}
      onRenderGroup={(e) => {
        eventBus.requestTrigger('renderGroup', e);
        e.datas.isRender = true;
      }}
      onRenderGroupEnd={(e) => {
        eventBus.requestTrigger('renderGroup', e);

        if (!e.datas.isRender) {
          return;
        }
        const prevDatas = e.datas.prevDatas;
        const infos = e.targets.map((target, i) => {
          return {
            id: getId(target),
            prev: prevDatas[i],
            next: moveableHelper.getFrame(target).get(),
          };
        });
        historyManager.addAction('renders', {
          infos,
        });
      }}
    />
  );
};

export default MoveableManager;
