import { Body, System } from 'detect-collisions';
import MoveableHelper from 'moveable-helper';
import { RefObject } from 'react';
import Moveable from 'react-moveable';

import { Viewport } from '@/_pages/Customizator/components';
import { getEditorTarget } from '@/shared/utils';
import { IObject } from '@daybrush/utils';
import { diff } from '@egjs/list-differ';

import type { DOMDirections, EventBus } from '@/_pages/Customizator/types';
const restoreRender = (
  id: string,
  state: IObject<any>,
  prevState: IObject<any>,
  orders: any,
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
) => {
  const el = viewportRef.current?.getElement(id);

  if (!el) {
    console.error('No Element');
    return false;
  }
  const frame = moveableHelper.getFrame(el);

  frame.clear();
  frame.set(state);
  frame.setOrderObject(orders);

  const result = diff(Object.keys(prevState), Object.keys(state));
  const { removed, prevList } = result;

  removed.forEach((index) => {
    el.style.removeProperty(prevList[index]);
  });
  moveableHelper.render(el);
  return true;
};

export const undoRender = (
  { id, prev, next, prevOrders }: IObject<any>,
  eventBus: EventBus,
  moveable: RefObject<Moveable>,
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
) => {
  if (!restoreRender(id, prev, next, prevOrders, viewportRef, moveableHelper)) {
    return;
  }
  moveable.current?.updateRect();
  eventBus.emitter.trigger('render');
};

export const redoRender = (
  { id, prev, next, nextOrders }: IObject<any>,
  eventBus: EventBus,
  moveable: RefObject<Moveable>,
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
) => {
  if (!restoreRender(id, next, prev, nextOrders, viewportRef, moveableHelper)) {
    return;
  }
  moveable.current?.updateRect();
  eventBus.emitter.trigger('render');
};

export const undoRenders = (
  { infos }: IObject<any>,
  eventBus: EventBus,
  moveable: RefObject<Moveable>,
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
) => {
  infos.forEach(({ id, prev, next, prevOrders }: IObject<any>) => {
    restoreRender(id, prev, next, prevOrders, viewportRef, moveableHelper);
  });
  moveable.current?.updateRect();
  eventBus.emitter.trigger('render');
};

export const redoRenders = (
  { infos }: IObject<any>,
  eventBus: EventBus,
  moveable: RefObject<Moveable>,
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
) => {
  infos.forEach(({ id, next, prev, nextOrders }: IObject<any>) => {
    restoreRender(id, next, prev, nextOrders, viewportRef, moveableHelper);
  });
  moveable.current?.updateRect();
  eventBus.emitter.trigger('render');
};

/**
 *
 * @param boundingRect - rect with coordinates and sized of bounding div containing target
 * @param targetRect - rect with coordinates and sized of target div
 * @param linearThreshold - number between 0 and 1, threshold proportion of length or width allowed outside of bounding rect,
 *                          linearThreshold=0 means no pixel is allowed to be outside the bounding rect,
 *                          linearThreshold=1 means the object is allowed to be outside the bounding rect to the full extent and is still considered
 *                          to be inside the bounding rect
 *
 * @returns {left: undefined | number, top: undefined | number, right: undefined | number, bottom: undefined | number},
 *                          where undefined means no overflow for the given direction, otherwise outer threshold value is returned.
 */
export const isTargetOutside = (
  boundingRect: DOMRect,
  targetRect: DOMRect,
  linearThreshold = 0.9,
) => {
  if (!targetRect || !boundingRect) return {};

  const thresholdWidth = linearThreshold * targetRect.width;
  const thresholdHeight = linearThreshold * targetRect.height;

  type Rect = { [key in DOMDirections]: number };

  const extrema: Rect = {
    left: boundingRect.left - thresholdWidth,
    top: boundingRect.top - thresholdHeight,
    right: boundingRect.right + thresholdWidth,
    bottom: boundingRect.bottom + thresholdHeight,
  };

  const isWithinBoundaries = (boundary: Rect, target: Rect, direction: DOMDirections) =>
    ['left', 'top'].includes(direction)
      ? boundary[direction] <= target[direction]
      : boundary[direction] >= target[direction];

  const directions = Object.keys(extrema) as DOMDirections[];

  const result = Object.fromEntries(
    directions.map((direction: DOMDirections) => {
      return [
        direction,
        isWithinBoundaries(extrema, targetRect, direction) ? undefined : extrema[direction],
      ];
    }),
  );

  return result;
};

export const highlightCollidedBody = (
  collisionSystem: System<Body> | undefined,
  id: string | undefined | null,
  body: Body | undefined | null,
) => {
  if (!collisionSystem || !body || !id) return;

  const collided = collisionSystem.checkOne(body, () => true);

  const target = getEditorTarget(id);
  if (!target) return;
  if (collided) {
    target.classList.add('body-collision-error');
  } else {
    target.classList.remove('body-collision-error');
  }
};
