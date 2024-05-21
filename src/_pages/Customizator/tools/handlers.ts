import { Body, deg2rad, Ellipse, SATVector, System } from 'detect-collisions';
import MoveableHelper from 'moveable-helper';
import { RefObject } from 'react';
import Moveable from 'react-moveable';
import Selecto, { Rect } from 'react-selecto';
import { Frame } from 'scenejs';

import { Viewport } from '@/_pages/Customizator/components';
import {
  CollisionBody,
  EventBus,
  HistoryManager,
  InitDOMRect,
  SetCollisionBodies,
  TargetsManager,
  ToolManager,
  ViewportManager,
} from '@/_pages/Customizator/types';
import {
  appendJSXs,
  getId,
  getRelativeBoundingRect,
  isWidgetId,
} from '@/_pages/Customizator/utils';
import { setSelectedTargets } from '@/_pages/Customizator/utils/MoveableHelper';
import { IObject } from '@daybrush/utils';

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

const approximateRoundedRectangle = (
  width: number,
  height: number,
  left: number,
  top: number,
  borderRadius: number,
) => {
  const radius = Math.min(Math.min(width, height) / 2, borderRadius);

  const pi = Math.PI;
  const dl1 = radius * (1 - Math.cos(pi / 6));
  const dl2 = radius * (1 - Math.cos(pi / 3));

  if (radius === 0) {
    //TODO: pure rectangle
    const point1 = { x: 0, y: 0 };
    const point2 = { x: width, y: 0 };
    const point3 = { x: width, y: height };
    const point4 = { x: 0, y: height };

    const polygon = [point1, point2, point3, point4] as SATVector[];

    return polygon;
  }
  //rounded rectangle
  const point1 = { x: 0, y: radius };
  const point2 = { x: dl1, y: dl2 };
  const point3 = { x: dl2, y: dl1 };
  const point4 = { x: radius, y: 0 };

  const point5 = { x: width - radius, y: 0 };
  const point6 = { x: width - dl2, y: dl1 };
  const point7 = { x: width - dl1, y: dl2 };
  const point8 = { x: width, y: radius };

  const point9 = { x: width, y: height - radius };
  const point10 = { x: width - dl1, y: height - dl2 };
  const point11 = { x: width - dl2, y: height - dl1 };
  const point12 = { x: width - radius, y: height };

  const point13 = { x: radius, y: height };
  const point14 = { x: dl2, y: height - dl1 };
  const point15 = { x: dl1, y: height - dl2 };
  const point16 = { x: 0, y: height - radius };

  const polygon = [
    point1,
    point2,
    point3,
    point4,
    point5,
    point6,
    point7,
    point8,
    point9,
    point10,
    point11,
    point12,
    point13,
    point14,
    point15,
    point16,
  ] as SATVector[];

  return polygon;
};

export const parseFloatTranslateProps = (
  style: IObject<string>,
  bodyType: CollisionBody,
  viewportRect: DOMRect,
  targetRect: DOMRect,
) => {
  if (!style) return { translateX: 0, translateY: 0 };

  const str = style.transform;
  const extractedString = str?.match(/\(([^)]+)\)/);

  if (!extractedString) {
    return { translateX: 0, translateY: 0 };
  }

  const [trX, trY] = extractedString[1].split(',').map((v) => v.trim());
  const { translateX, translateY } = parseFloatProperties(
    { translateX: trX, translateY: trY },
    bodyType,
    viewportRect,
    targetRect,
  );

  return { translateX, translateY };
};

export const parseFloatProperties = (
  obj: IObject<string>,
  type: CollisionBody,
  parentSize?: { width: number; height: number },
  targetSize?: DOMRect,
): IObject<number> => {
  const keyValues = Object.keys(obj).map((prop) => {
    const value = obj[prop];

    if (!value) {
      return [prop, NaN];
    }

    if (value === '0') {
      return [prop, 0];
    }

    if (value.endsWith('%') && prop.startsWith('translate') && targetSize) {
      const numericValue = parseFloat(value);
      return [prop, (numericValue * targetSize.width) / 100];
    }

    if (value.endsWith('%') && parentSize) {
      const numericValue = parseFloat(value);
      if (['width', 'left'].includes(prop)) {
        return [prop, (numericValue * parentSize.width) / 100];
      }
      if (['height', 'top'].includes(prop)) {
        return [prop, (numericValue * parentSize.height) / 100];
      }
    }

    if (value.endsWith('auto') && targetSize) {
      if (['width'].includes(prop)) {
        return [prop, targetSize.width];
      }
      if (['height'].includes(prop)) {
        return [prop, targetSize.height];
      }
    }

    if (value.endsWith('px')) {
      return [prop, parseFloat(value)];
    }
    console.error(
      `${type} bodies', ${prop} prop is defined as ${value}. It must be defined in px units for collision evaluation to work properly.`,
    );
    return [prop, NaN];
  });

  return Object.fromEntries(keyValues);
};

export const createBody = (
  type: CollisionBody,
  initRect: InitDOMRect,
  style: IObject<any>,
  collisionSystem: System<Body>,
) => {
  const { 'border-radius': br } = style;
  const { width, height, left, top } = initRect;
  const options = { isCentered: true };

  if (type === 'Ellipse') {
    const radiusX = width / 2;
    const radiusY = height / 2;
    const position = { x: left + radiusX, y: top + radiusY };

    return collisionSystem.createEllipse(position, radiusX, radiusY, 0, options);
  }

  if (type === 'RoundRect') {
    const parsedProps = parseFloatProperties({ borderRadius: br }, type);
    const polygon = approximateRoundedRectangle(width, height, left, top, parsedProps.borderRadius);

    const position = {
      x: left + width / 2,
      y: top + height / 2,
    };

    return collisionSystem.createPolygon(position, polygon, options);
  }

  console.error(`No handler found for ${type} body`);
};

export const updateBodySize = (bodyProps: { body: Body; initRect: DOMRect }, frame: Frame) => {
  const { body, initRect } = bodyProps;
  const { 'border-radius': br } = frame.properties;
  const { width, height, left, top } = initRect;

  if (body.type === 'Ellipse') {
    const ellipse = body as Ellipse;

    const radiusX = width / 2;
    const radiusY = height / 2;

    ellipse.radiusX = radiusX;
    ellipse.radiusY = radiusY;
    ellipse.updateBody();
    return;
  }

  if (body.type === 'Polygon') {
    const borderRadius = parseFloat(br);

    const points = approximateRoundedRectangle(width, height, left, top, borderRadius);

    body.setPoints(points);
    body.updateBody();
    return;
  }

  console.error(`No handler found for ${body.type} body`);
};

export const updateBodyPosition = (
  bodyProps: { body: Body; initRect: InitDOMRect },
  frame: Frame,
) => {
  const { body, initRect } = bodyProps;

  const { width, height, left, top } = initRect;

  if (body.type === 'Ellipse') {
    const props = frame.properties;
    const [translateX, translateY] = props.transform.translate.value.map((v: string) =>
      parseFloat(v),
    ) as number[];
    const radiusX = width / 2;
    const radiusY = height / 2;
    const position = {
      x: left + translateX + radiusX - initRect.translateX,
      y: top + translateY + radiusY - initRect.translateY,
    };
    const rotateDeg = parseFloat(props.transform.rotate);
    const rotateRad = deg2rad(rotateDeg);

    body.setPosition(position.x, position.y);
    body.setAngle(rotateRad);
    return;
  }

  if (body.type === 'Polygon') {
    const propsTranslate = frame.properties.transform.translate.value;
    const [translateX, translateY] = propsTranslate.map((v: string) => parseFloat(v));
    const position = {
      x: left + translateX - initRect.translateX + width / 2,
      y: top + translateY - initRect.translateY + height / 2,
    };

    const rotateDeg = parseFloat(frame.properties.transform.rotate);
    const rotateRad = deg2rad(rotateDeg);

    body.setPosition(position.x, position.y);
    body.setAngle(rotateRad);
    return;
  }

  console.error(`No handler found for ${body.type} body`);
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
  setCollisionBodies: SetCollisionBodies,
  collisionSystem: System<Body>,
) => {
  const zoom = viewportManager.viewportState.zoom;
  const selectedTool =
    toolManager.selectedTool.type === 'tool' ? toolManager.selectedTool : undefined;
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

  //create new jsx element

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
        attrs: { ...divElementProperties.attrs, alt: `(${selectedTool.id})` },
        name: `(${selectedTool.id})`,
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
    ?.then((targets) => {
      if (selectedTool.bodyType) {
        const bodyType = selectedTool.bodyType;
        targets.forEach((target) => {
          const id = getId(target);

          if (!isWidgetId(id)) return;

          const viewportRect = viewportRef?.current?.viewportRef.current?.getBoundingClientRect();
          if (!viewportRect || !id) return;
          const targetRect = getRelativeBoundingRect(target.getBoundingClientRect(), viewportRect);
          if (!targetRect) return;

          const frame = moveableHelper.getFrame(target);
          const translateStyle = frame.properties.transform.translate.value;

          const { translateX, translateY } = parseFloatProperties(
            { translateX: translateStyle[0], translateY: translateStyle[1] },
            bodyType,
            viewportRect,
            targetRect,
          );

          const initRect = { ...targetRect, translateX, translateY };

          const body = createBody(bodyType, initRect, style, collisionSystem);

          if (body && id) {
            setCollisionBodies((bodies) => ({ ...bodies, [id]: { body, initRect } }));
          }
        });
      }

      targets[0].focus();
    })
    .catch((error) => {
      console.error(`appending JSX failed: ${error}`);
    });
};
