import MoveableHelper from 'moveable-helper';
import { RefObject } from 'react';
import Selecto from 'react-selecto';

import { Viewport } from '@/_pages/Customizator/components';
import {
  ElementInfo,
  EventBus,
  FrameInfo,
  HistoryManager,
  MovedInfo,
  MovedResult,
  TargetsManager,
} from '@/_pages/Customizator/types';
import { appendJSXs, moves } from '@/_pages/Customizator/utils';
import { removeElements, setSelectedTargets } from '@/_pages/Customizator/utils/MoveableHelper';
import { IObject } from '@daybrush/utils';

export const undoCreateElements = async (
  undoProps: IObject<any>,
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
  targetsManager: TargetsManager,
  historyManager: HistoryManager,
  selecto: RefObject<Selecto>,
  eventBus: EventBus,
) => {
  const { infos, prevSelected } = undoProps;
  const ids = infos.map((info: ElementInfo) => info.id);
  const viewport = viewportRef?.current;

  if (!viewport) return;

  const res = await removeElements(
    viewportRef?.current.getElements(ids),
    viewportRef,
    moveableHelper,
    targetsManager,
    historyManager,
    selecto,
    eventBus,
    true,
  );

  if (prevSelected && res && viewport) {
    setSelectedTargets(
      viewport.getElements(prevSelected),
      targetsManager,
      historyManager,
      selecto,
      eventBus,
      true,
    );
  }
};

export const restoreElements = async (
  { infos }: IObject<any>,
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
  targetsManager: TargetsManager,
  historyManager: HistoryManager,
  selecto: RefObject<Selecto>,
  eventBus: EventBus,
) => {
  await appendJSXs(
    infos.map((info: ElementInfo) => ({
      ...info,
    })),
    viewportRef,
    moveableHelper,
    targetsManager,
    historyManager,
    selecto,
    eventBus,
    true,
  );
};

export const undoSelectTargets = (
  { prevs }: IObject<any>,
  viewportRef: RefObject<Viewport>,
  targetsManager: TargetsManager,
  historyManager: HistoryManager,
  selecto: RefObject<Selecto>,
  eventBus: EventBus,
) => {
  const viewport = viewportRef.current;
  if (!viewport) return;
  setSelectedTargets(
    viewport.getElements(prevs),
    targetsManager,
    historyManager,
    selecto,
    eventBus,
    true,
  );
};

export const redoSelectTargets = (
  { nexts }: IObject<any>,
  viewportRef: RefObject<Viewport>,
  targetsManager: TargetsManager,
  historyManager: HistoryManager,
  selecto: RefObject<Selecto>,
  eventBus: EventBus,
) => {
  const viewport = viewportRef.current;
  if (!viewport) return;
  setSelectedTargets(
    viewport.getElements(nexts),
    targetsManager,
    historyManager,
    selecto,
    eventBus,
    true,
  );
};

export const undoChangeText = ({ prev, id }: IObject<any>, viewportRef: RefObject<Viewport>) => {
  const viewport = viewportRef.current;
  if (!viewport) return;

  const info = viewport.getInfo(id);
  if (!info.el) return;

  info.innerText = prev;
  info.el.innerText = prev;
};

export const redoChangeText = ({ next, id }: IObject<any>, viewportRef: RefObject<Viewport>) => {
  const viewport = viewportRef.current;
  if (!viewport) return;

  const info = viewport.getInfo(id);
  if (!info.el) return;

  info.innerText = next;
  info.el.innerText = next;
};

export const undoMove = async (
  { prevInfos }: MovedResult,
  viewportRef: RefObject<Viewport>,
  selecto: RefObject<Selecto>,
  targetsManager: TargetsManager,
  moveableHelper: MoveableHelper,
  eventBus: EventBus,
  historyManager: HistoryManager,
) => {
  await moves(
    prevInfos,
    viewportRef,
    moveableHelper,
    targetsManager,
    historyManager,
    selecto,
    eventBus,
    true,
  );
};

export const redoMove = async (
  { nextInfos }: MovedResult,
  viewportRef: RefObject<Viewport>,
  selecto: RefObject<Selecto>,
  targetsManager: TargetsManager,
  moveableHelper: MoveableHelper,
  eventBus: EventBus,
  historyManager: HistoryManager,
) => {
  await moves(
    nextInfos,
    viewportRef,
    moveableHelper,
    targetsManager,
    historyManager,
    selecto,
    eventBus,
    true,
  );
};

export const restoreFrames = (
  infos: MovedInfo[],
  frameMap: IObject<FrameInfo>,
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
) => {
  const viewport = viewportRef.current;
  if (!viewport) return;

  infos
    .map(({ info }) => info)
    .forEach(function registerFrame(info: ElementInfo) {
      const id = info.id;
      if (!id) return;

      info.frame = frameMap[id].frame;
      info.frameOrder = frameMap[id].order;
      delete frameMap[id];

      info.children?.forEach(registerFrame);
    });

  for (const id in frameMap) {
    const element = viewport.getInfo(id).el;
    if (!element) continue;

    moveableHelper.createFrame(element, frameMap[id]);
  }
};
