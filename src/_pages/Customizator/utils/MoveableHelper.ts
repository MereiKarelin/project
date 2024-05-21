import MoveableHelper from 'moveable-helper';
import { RefObject } from 'react';
import Selecto from 'react-selecto';
import { Frame } from 'scenejs';

import { Viewport } from '@/_pages/Customizator/components';
import {
  ElementInfo,
  EventBus,
  HistoryManager,
  TargetsManager,
  ToolManager,
} from '@/_pages/Customizator/types';
import { IObject } from '@daybrush/utils';
import { invert, matrix3d } from '@scena/matrix';

import { checkImageLoaded, getId, getIds, getOffsetOriginMatrix, setMoveMatrix } from './';

export const getSelectedFrames = (
  selectedTargets: (HTMLElement | SVGElement)[],
  moveableHelper: MoveableHelper,
) => {
  return selectedTargets.map((target) => moveableHelper.getFrame(target));
};

export const removeFrames = (
  targets: Array<HTMLElement | SVGElement>,
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
) => {
  const frameMap: IObject<{
    frame: IObject<any>;
    frameOrder: IObject<any>;
  }> = {};

  const viewport = viewportRef.current;
  if (!viewport) return;

  targets.forEach(function removeFrame(target) {
    const info = viewport.getInfoByElement(target);
    if (!info?.id) return;

    const frame = moveableHelper.getFrame(target);
    frameMap[info.id] = {
      frame: frame.get(),
      frameOrder: frame.getOrderObject(),
    };
    moveableHelper.removeFrame(target);

    info.children?.forEach((childInfo) => {
      if (!childInfo?.el) return;
      removeFrame(childInfo.el);
    });
  });

  return frameMap;
};

export const setSelectedTargets = (
  targets: (HTMLElement | SVGElement | null | undefined)[] | undefined,
  targetsManager: TargetsManager,
  historyManager: HistoryManager,
  selecto: RefObject<Selecto>,
  eventBus: EventBus,
  isRestore?: boolean,
) => {
  const filteredTargets = targets?.filter(
    (target) => target && target.dataset.scenaElementId !== 'viewport',
  ) as (HTMLElement | SVGElement)[];

  if (!filteredTargets) return;

  targetsManager.setSelectedTargets(filteredTargets);

  if (!isRestore) {
    const prevs = getIds(targetsManager.selectedTargets);
    const nexts = getIds(filteredTargets);

    if (prevs.length !== nexts.length || !prevs.every((prev, i) => nexts[i] === prev)) {
      historyManager.addAction('selectTargets', { prevs, nexts });
    }
  }
  selecto.current?.setSelectedTargets(filteredTargets);
  eventBus.emitter.trigger('setSelectedTargets');
  return filteredTargets;
};

export const removeElements = (
  targets: Array<HTMLElement | SVGElement>,
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
  targetsManager: TargetsManager,
  historyManager: HistoryManager,
  selecto: RefObject<Selecto>,
  eventBus: EventBus,
  isRestore?: boolean,
) => {
  const viewport = viewportRef.current;
  if (!viewport) return;
  const frameMap = removeFrames(targets, viewportRef, moveableHelper);

  const indexesList = viewport.getSortedIndexesList(targets);
  const indexesListLength = indexesList.length;
  let scopeId = '';
  let selectedInfo: ElementInfo | null = null;

  if (indexesListLength) {
    const lastInfo = viewport.getInfoByIndexes(indexesList[indexesListLength - 1]);
    const nextInfo = viewport.getNextInfo(lastInfo?.id ?? '');

    scopeId = lastInfo.scopeId ?? '';
    selectedInfo = nextInfo ?? null;
  }
  return viewport.removeTargets(targets).then(({ removed }) => {
    const selectedTarget =
      selectedInfo || viewport.getLastChildInfo(scopeId) || viewport.getInfo(scopeId);

    setSelectedTargets(
      selectedTarget && selectedTarget.el ? [selectedTarget.el] : [],
      targetsManager,
      historyManager,
      selecto,
      eventBus,
      true,
    );

    !isRestore &&
      historyManager.addAction('removeElements', {
        infos: removed.map(function removeTarget(info: ElementInfo): ElementInfo {
          return {
            ...info,
            children: info.children?.map(removeTarget),
            ...(frameMap?.[info.id ?? ''] || {}),
          };
        }),
      });
    return targets;
  });
};

export const appendComplete = (
  infos: ElementInfo[],
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
  targetsManager: TargetsManager,
  historyManager: HistoryManager,
  selecto: RefObject<Selecto>,
  eventBus: EventBus,
  isRestore?: boolean,
) => {
  !isRestore &&
    historyManager.addAction('createElements', {
      infos,
      prevSelected: getIds(targetsManager.selectedTargets),
    });
  const container = viewportRef.current?.viewportRef.current;
  const targets = infos
    .map(function registerFrame(info) {
      if (!info?.el) return;
      const frame = moveableHelper.createFrame(info.el, info.frame);

      if (info.frameOrder) {
        frame.setOrderObject(info.frameOrder);
      }
      moveableHelper.render(info.el);

      info.children?.forEach(registerFrame);
      return info.el;
    })
    .filter((el) => el) as HTMLElement[];
  infos.forEach((info) => {
    if (!info.moveMatrix || !info?.el || !container) {
      return;
    }
    const frame = moveableHelper.getFrame(info.el);
    let nextMatrix = getOffsetOriginMatrix(info.el, container);

    nextMatrix = invert(nextMatrix, 4);

    const moveMatrix = matrix3d(nextMatrix, info.moveMatrix);

    setMoveMatrix(frame, moveMatrix);
    moveableHelper.render(info.el);
  });
  return Promise.all(targets.map((target) => checkImageLoaded(target))).then(() => {
    setSelectedTargets(targets, targetsManager, historyManager, selecto, eventBus, true);

    return targets;
  });
};

export const renderFrames = (moveableHelper: MoveableHelper, targetsManager: TargetsManager) => {
  targetsManager.selectedTargets.forEach((target: any) => {
    moveableHelper.render(target);
  });
};

export const setValue = (
  callback: (frame: Frame, target: HTMLElement | SVGElement) => void,
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
  targetsManager: TargetsManager,
) => {
  const targets = targetsManager.selectedTargets;

  const infos = targets.map((target) => {
    const frame = moveableHelper.getFrame(target);
    const prevOrders = frame.getOrderObject();
    const prev = frame.get();

    callback(frame, target);
    const next = frame.get();
    const nextOrders = frame.getOrderObject();

    return { id: getId(target), prev, prevOrders, next, nextOrders };
  });
  renderFrames(moveableHelper, targetsManager);

  return infos;
};

export const setMoveableProperty = (
  names: string[],
  value: any,
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
  targetsManager: TargetsManager,
) => {
  return setValue(
    (frame) => {
      frame.set(...names, value);
    },
    viewportRef,
    moveableHelper,
    targetsManager,
  );
};

export const removeProperties = (
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
  targetsManager: TargetsManager,
  ...names: string[]
) =>
  setValue(
    (frame, target) => {
      names.forEach((name) => {
        frame.remove(name);
        target.style.removeProperty(name);
      });
    },
    viewportRef,
    moveableHelper,
    targetsManager,
  );

export const getProperties = (
  properties: string[][],
  defaultValues: any[],
  moveableHelper: MoveableHelper,
  targetsManager: TargetsManager,
  toolManager: ToolManager,
) => {
  const frames = getSelectedFrames(targetsManager.selectedTargets, moveableHelper);
  const toolProperties = toolManager.toolProperties;

  if (!frames.length) {
    return properties.map(
      (property, i) => toolProperties.get(property.join('///')) || defaultValues[i],
    );
  }

  return properties.map((property, i) => {
    const frameValues = frames.map((frame) => frame.get(...property));

    return frameValues.filter((color) => color)[0] || defaultValues[i];
  });
};
