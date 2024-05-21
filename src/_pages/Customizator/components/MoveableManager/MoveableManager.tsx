import { Body, System } from 'detect-collisions';
import MoveableHelper from 'moveable-helper';
import { Dispatch, RefObject, SetStateAction, useEffect, useState } from 'react';
import Moveable, { OnDragOrigin, OnEvent } from 'react-moveable';
import Selecto from 'react-selecto';
import { Frame } from 'scenejs';

import { Viewport } from '@/_pages/Customizator/components';
import {
  DeleteButtonViewable,
  TextPropViewable,
} from '@/_pages/Customizator/components/Viewport/ables';
import { ChangeImageButtonViewable } from '@/_pages/Customizator/components/Viewport/ables/ChangeImageButtonViewable';
import { tools, widgets } from '@/_pages/Customizator/consts';
import { FontPropertiesTool } from '@/_pages/Customizator/tools';
import { updateBodyPosition, updateBodySize } from '@/_pages/Customizator/tools/handlers';
import {
  getContentElement,
  getId,
  getRelativeBoundingRect,
  isWidgetId,
  parseNumericStyleValue,
  parseWidgetType,
} from '@/_pages/Customizator/utils';
import {
  highlightCollidedBody,
  redoRender,
  redoRenders,
  undoRender,
  undoRenders,
} from '@/_pages/Customizator/utils/MoveableManager';
import { Direction } from '@/shared/types';
import { getSubMenuPosition } from '@/shared/utils';

import type {
  CollisionBodies,
  EventBus,
  HistoryManager,
  InitDOMRect,
  SetCollisionBodies,
  Tool,
  ToolManager,
} from '@/_pages/Customizator/types';

type PropTypes = {
  selectedTargets: Array<HTMLElement | SVGElement>;
  selectedMenu: Tool | undefined;
  verticalGuidelines: number[];
  horizontalGuidelines: number[];
  zoom: number;
  moveableHelper: MoveableHelper;
  moveable: RefObject<Moveable>;
  isShift: boolean;
  eventBus: EventBus;
  historyManager: HistoryManager;
  viewportRef: RefObject<Viewport>;
  toolManager: ToolManager;
  selecto: RefObject<Selecto>;
  clipPath?: string;
  collisionBodies: CollisionBodies;
  setCollisionBodies: SetCollisionBodies;
  collisionSystem: System<Body>;
  setIsSubMenuShown: Dispatch<SetStateAction<boolean>>;
  setSubMenuPosition: Dispatch<
    SetStateAction<{
      offset: { [key in Direction]?: number };
      position: Direction;
    }>
  >;
  handleChangeImage: (id: string) => void;
  onDelete: (id: string) => void;
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
  toolManager,
  collisionBodies,
  setCollisionBodies,
  collisionSystem,
  setIsSubMenuShown,
  setSubMenuPosition,
  clipPath = 'rect',
  handleChangeImage,
  onDelete,
}: PropTypes) => {
  const [activeBody, setActiveBody] = useState<{
    body: Body;
    initRect: InitDOMRect;
    frame: Frame;
  }>();
  const [goodFrame, setGoodFrame] = useState<Frame>();
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

  const registerStartBodyFrame = (e: OnEvent) => {
    const id = getId(e.target);
    if (!isWidgetId(id)) return; //check collisions only for widgets

    if (id) {
      const frame = moveableHelper.getFrame(e.target);
      const body = collisionBodies[id];
      if (body) {
        setActiveBody(() => ({ ...body, frame }));
        setGoodFrame(frame.clone());
        return;
      }
    }
    setActiveBody(undefined);
  };

  const checkCollisionEnd = (e: OnEvent) => {
    if (activeBody && goodFrame) {
      const id = getId(e.target);
      if (!isWidgetId(id)) return; //check collisions only for widgets

      const collided = collisionSystem.checkOne(activeBody.body, () => true);

      if (collided) {
        const lines = document.getElementsByClassName('moveable-line');
        for (const line of lines) {
          const lineElement = line as HTMLDivElement;
          lineElement.style.backgroundColor = '#4af';
        }
        const { body, initRect } = activeBody;
        updateBodyPosition({ body, initRect }, goodFrame);

        moveableHelper.setFrame(e.target, goodFrame);
        moveableHelper.render(e.target);

        setCollisionBodies((bodies) => ({ ...bodies }));
      }
    }
  };

  const elementGuidelines = [document.querySelector('.scena-viewport')];
  const moveableId = getId(selectedTargets[0]);
  const moveableType = parseWidgetType(moveableId);

  const target = selectedTargets[0] as HTMLElement;

  const widget = moveableId ? widgets[moveableType] : undefined;
  const isDeletable = (!widget?.isRequired && moveableId !== null) ?? true; // required widgets can not be deleted
  const isResizable = !isWidgetId(moveableId) || moveableId !== null; // widgets can not be resized
  const isTextCustomizable =
    (target.isContentEditable && !!moveableId) || widget?.isWidgetCustomizable === true;
  const isDraggable = selectedMenu?.id === 'Move';

  const displayTextProperties = () => {
    const elem = document.getElementById('textPropViewableButton');

    toolManager.setSelectedTool(() => FontPropertiesTool);
    const boundingRect = elem?.getBoundingClientRect();
    const editingAreaRect = document.getElementById('editingArea')?.getBoundingClientRect();
    if (boundingRect && editingAreaRect) {
      const targetRect = getRelativeBoundingRect(boundingRect, editingAreaRect);

      const horizontalPosition = getSubMenuPosition(targetRect, FontPropertiesTool.subMenuWidth, {
        top: targetRect.top + targetRect.height + 10,
      });

      const position: Direction =
        horizontalPosition.position === 'left'
          ? 'topLeft'
          : horizontalPosition.position === 'right'
            ? 'topRight'
            : 'topCenter';

      setSubMenuPosition(() => ({ ...horizontalPosition, position }));
    }

    setIsSubMenuShown((isShown) => !isShown);
  };

  return (
    <Moveable
      ables={[DeleteButtonViewable, TextPropViewable, ChangeImageButtonViewable]}
      props={{
        deleteButtonViewable: isDeletable,
        changeImageButtonViewable: widget?.isCustomBackground ?? false,
        textPropViewable: isTextCustomizable,
        onClickDelete: () => onDelete(moveableId ?? ''),
        onClickTextProps: displayTextProperties,
        onClickChangeImageButton: () => handleChangeImage(moveableId || ''),
      }}
      ref={moveable}
      targets={selectedTargets}
      draggable={isDraggable}
      resizable={isResizable}
      pinchable={['rotatable']}
      snapContainer={'scena-viewport-container'}
      renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
      zoom={1 / zoom}
      throttleResize={1}
      clippable={selectedMenu?.id.startsWith('Crop')}
      passDragArea={selectedMenu?.id.startsWith('Text')}
      checkInput={selectedMenu?.id.startsWith('Text')}
      throttleDragRotate={isShift ? 45 : 0}
      keepRatio={selectedTargets.length > 1 ? true : isShift}
      rotatable={moveableId !== null}
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
      onDragStart={(e) => {
        moveableHelper.onDragStart(e);
        if (widget) {
          registerStartBodyFrame(e);
        }
      }}
      onDrag={moveableHelper.onDrag}
      onDragGroupStart={moveableHelper.onDragGroupStart}
      onDragGroup={moveableHelper.onDragGroup}
      onScaleStart={moveableHelper.onScaleStart}
      onScale={moveableHelper.onScale}
      onScaleGroupStart={moveableHelper.onScaleGroupStart}
      onScaleGroup={moveableHelper.onScaleGroup}
      onResizeStart={(e) => {
        moveableHelper.onResizeStart(e);
        if (widget) {
          registerStartBodyFrame(e);
        }
      }}
      onResize={moveableHelper.onResize}
      onResizeEnd={(e) => {
        const id = getId(e.target);
        if (id) {
          const frame = moveableHelper.getFrame(e.target);
          const body = collisionBodies[id];
          if (body) {
            let initRect = {
              ...body.initRect,
              width: parseNumericStyleValue(frame.properties.width),
              height: parseNumericStyleValue(frame.properties.height),
            };

            initRect = {
              ...initRect,
              left: -initRect.width / 2,
              top: -initRect.height / 2,
            };

            const updatedBody = { ...body, initRect };
            setCollisionBodies((bodies) => ({
              ...bodies,
              [id]: updatedBody,
            }));
            updateBodySize(updatedBody, frame);
            setActiveBody(() => ({ ...updatedBody, frame }));
            return;
          }
        }
      }}
      onResizeGroupStart={moveableHelper.onResizeGroupStart}
      onResizeGroup={moveableHelper.onResizeGroup}
      onRotateStart={(e) => {
        moveableHelper.onRotateStart(e);
        registerStartBodyFrame(e);
      }}
      onRotate={moveableHelper.onRotate}
      onRotateEnd={(e) => {
        checkCollisionEnd(e);
      }}
      onRotateGroupStart={moveableHelper.onRotateGroupStart}
      onRotateGroup={moveableHelper.onRotateGroup}
      onRoundEnd={(e) => {
        const id = getId(e.target);
        if (id) {
          const frame = moveableHelper.getFrame(e.target);
          frame.set({
            'border-radius': e.target.style.borderRadius,
          });

          const body = collisionBodies[id];
          if (body) {
            const initRect = {
              ...body.initRect,
            };

            setCollisionBodies((bodies) => ({
              ...bodies,
              [id]: { body: body.body, initRect },
            }));
            setActiveBody(() => ({ ...body, frame }));
            updateBodySize(body, frame);

            return;
          }
        }
      }}
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
        if (activeBody) {
          const id = getId(e.target);
          if (!isWidgetId(id)) return; //check collisions only for widgets

          const { body, initRect, frame } = activeBody;
          updateBodyPosition({ body, initRect }, frame);
          const collided = collisionSystem.checkOne(body, () => {
            return true; //end after first collision
          });

          if (collided) {
            const lines = document.getElementsByClassName('moveable-line');
            for (const line of lines) {
              const lineElement = line as HTMLDivElement;
              lineElement.style.backgroundColor = '#bd2c01';
            }
            return;
          }

          const lines = document.getElementsByClassName('moveable-line');
          for (const line of lines) {
            const lineElement = line as HTMLDivElement;
            lineElement.style.backgroundColor = '#4af';
          }
        }
        eventBus.requestTrigger('render');
      }}
      onRenderEnd={(e) => {
        if (!e.datas.isRender) {
          return;
        }

        checkCollisionEnd(e);
        const frame = moveableHelper.getFrame(e.target);
        frame.set({
          'border-radius': e.target.style.borderRadius,
        });

        highlightCollidedBody(collisionSystem, moveableId, activeBody?.body);
        historyManager.addAction('render', {
          id: getId(e.target),
          prev: e.datas.prevData,
          next: moveableHelper.getFrame(e.target).get(),
        });
        eventBus.requestTrigger('render');
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
