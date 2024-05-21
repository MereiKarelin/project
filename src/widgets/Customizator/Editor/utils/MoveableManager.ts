import MoveableHelper from 'moveable-helper';
import { RefObject } from 'react';
import Moveable from 'react-moveable';

import { Viewport } from '@/widgets/Customizator/Editor/components';
import { IObject } from '@daybrush/utils';
import { diff } from '@egjs/list-differ';

import type { EventBus } from '@/widgets/Customizator/Editor/types';
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
