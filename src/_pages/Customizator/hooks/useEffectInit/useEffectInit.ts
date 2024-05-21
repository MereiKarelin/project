import MoveableHelper from 'moveable-helper';
import { RefObject, useEffect } from 'react';
import Moveable from 'react-moveable';
import Selecto from 'react-selecto';

import { Viewport } from '@/_pages/Customizator/components';
import {
  EventBus,
  HistoryManager,
  KeyManager,
  TargetsManager,
  ToolManager,
} from '@/_pages/Customizator/types';
import { move, moveInside, moveOutside, onResize } from '@/_pages/Customizator/utils';
import { removeElements, setSelectedTargets } from '@/_pages/Customizator/utils/MoveableHelper';
import {
  redoChangeText,
  redoMove,
  redoSelectTargets,
  restoreElements,
  undoChangeText,
  undoCreateElements,
  undoMove,
  undoSelectTargets,
} from '@/_pages/Customizator/utils/RestoreActions';
import Guides from '@scena/react-guides';

export const useEffectInit = (
  isMacintosh: boolean,
  moveable: RefObject<Moveable<object>>,
  targetsManager: TargetsManager,
  viewportRef: RefObject<Viewport>,
  keyManager: KeyManager,
  moveableHelper: MoveableHelper,
  selecto: RefObject<Selecto>,
  eventBus: EventBus,
  historyManager: HistoryManager,
  toolManager: ToolManager,
  verticalGuides: RefObject<Guides>,
  horizontalGuides: RefObject<Guides>,
) => {
  useEffect(() => {
    const { toolProperties } = toolManager;

    toolProperties.set('background-color', '#4af');
    toolProperties.set('color', '#333');
    requestAnimationFrame(() => {
      verticalGuides.current?.resize();
      horizontalGuides.current?.resize();
    });
    window.addEventListener('resize', () => onResize(horizontalGuides, verticalGuides));

    eventBus.emitter.on('selectLayers', (e: any) => {
      const selected = e.selected as string[];

      setSelectedTargets(
        selected.map((key) => viewportRef.current?.getInfo(key).el),
        targetsManager,
        historyManager,
        selecto,
        eventBus,
      );
    });

    historyManager.registerType(
      'createElements',
      (props: any) =>
        undoCreateElements(
          props,
          viewportRef,
          moveableHelper,
          targetsManager,
          historyManager,
          selecto,
          eventBus,
        ),
      (props: any) =>
        restoreElements(
          props,
          viewportRef,
          moveableHelper,
          targetsManager,
          historyManager,
          selecto,
          eventBus,
        ),
    );

    historyManager.registerType(
      'removeElements',
      (props: any) =>
        restoreElements(
          props,
          viewportRef,
          moveableHelper,
          targetsManager,
          historyManager,
          selecto,
          eventBus,
        ),
      (props: any) =>
        undoCreateElements(
          props,
          viewportRef,
          moveableHelper,
          targetsManager,
          historyManager,
          selecto,
          eventBus,
        ),
    );

    historyManager.registerType(
      'selectTargets',
      (props: any) =>
        undoSelectTargets(props, viewportRef, targetsManager, historyManager, selecto, eventBus),
      (props: any) =>
        redoSelectTargets(props, viewportRef, targetsManager, historyManager, selecto, eventBus),
    );

    historyManager.registerType(
      'changeText',
      (props: any) => undoChangeText(props, viewportRef),
      (props: any) => redoChangeText(props, viewportRef),
    );

    historyManager.registerType(
      'move',
      (props: any) =>
        undoMove(
          props,
          viewportRef,
          selecto,
          targetsManager,
          moveableHelper,
          eventBus,
          historyManager,
        ),
      (props: any) =>
        redoMove(
          props,
          viewportRef,
          selecto,
          targetsManager,
          moveableHelper,
          eventBus,
          historyManager,
        ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isTextMoveable = (moveable: RefObject<Moveable<object>>) => {
      const target = moveable.current?.moveable.props.target as HTMLElement;
      return target?.isContentEditable;
    };

    keyManager.addKeyDownCallback(
      ['left'],
      (e: any) => {
        if (isTextMoveable(moveable) || !moveable.current) return;
        move(-10, 0, moveable);
        e.inputEvent.preventDefault();
      },
      'Move Left',
    );
    keyManager.addKeyDownCallback(
      ['up'],
      (e: any) => {
        if (isTextMoveable(moveable) || !moveable.current) return;
        move(0, -10, moveable);
        e.inputEvent.preventDefault();
      },
      'Move Up',
    );
    keyManager.addKeyDownCallback(
      ['right'],
      (e: any) => {
        if (isTextMoveable(moveable) || !moveable.current) return;
        move(10, 0, moveable);
        e.inputEvent.preventDefault();
      },
      'Move Right',
    );
    keyManager.addKeyDownCallback(
      ['down'],
      (e: any) => {
        if (isTextMoveable(moveable) || !moveable.current) return;
        move(0, 10, moveable);
        e.inputEvent.preventDefault();
      },
      'Move Down',
    );
    keyManager.addKeyUpCallback(
      ['backspace'],
      async () => {
        if (isTextMoveable(moveable) || !moveable.current) return;
        await removeElements(
          targetsManager.selectedTargets,
          viewportRef,
          moveableHelper,
          targetsManager,
          historyManager,
          selecto,
          eventBus,
        );
      },
      'Delete',
    );

    keyManager.addKeyDownCallback([isMacintosh ? 'meta' : 'ctrl', 'x'], () => {}, 'Cut');
    keyManager.addKeyDownCallback([isMacintosh ? 'meta' : 'ctrl', 'c'], () => {}, 'Copy');
    keyManager.addKeyDownCallback([isMacintosh ? 'meta' : 'ctrl', 'v'], () => {}, 'Paste');
    keyManager.addKeyDownCallback(
      [isMacintosh ? 'meta' : 'ctrl', 'z'],
      () => {
        historyManager.undo();
      },
      'Undo',
    );

    keyManager.addKeyDownCallback(
      [isMacintosh ? 'meta' : 'ctrl', 'shift', 'z'],
      () => {
        historyManager.redo();
      },
      'Redo',
    );

    const infoElements = viewportRef?.current?.getViewportInfos()?.map((info) => info.el);

    keyManager.addKeyDownCallback(
      [isMacintosh ? 'meta' : 'ctrl', 'a'],
      (e: any) => {
        setSelectedTargets(infoElements, targetsManager, historyManager, selecto, eventBus);
        e.inputEvent.preventDefault();
      },
      'Select All',
    );
    keyManager.addKeyDownCallback(
      [isMacintosh ? 'meta' : 'ctrl', 'alt', 'g'],
      async (e: any) => {
        e.inputEvent.preventDefault();
        await moveInside(
          viewportRef,
          moveableHelper,
          targetsManager,
          historyManager,
          selecto,
          eventBus,
        );
      },
      'Move Inside',
    );
    keyManager.addKeyDownCallback(
      [isMacintosh ? 'meta' : 'ctrl', 'shift', 'alt', 'g'],
      (e: any) => {
        e.inputEvent.preventDefault();
        moveOutside(viewportRef, moveableHelper, targetsManager, historyManager, selecto, eventBus);
      },
      'Move Outside',
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMacintosh]);
};
