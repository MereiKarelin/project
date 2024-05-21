import '@/widgets/Customizator/Editor/components/Editor/App.css';

import MoveableHelper from 'moveable-helper';
import { useEffect, useRef, useState } from 'react';
import { styled } from 'react-css-styled';
import Moveable, { getElementInfo } from 'react-moveable';
import Selecto from 'react-selecto';

import { MoveableManager, Toolbar, Viewport } from '@/widgets/Customizator/Editor/components';
import { DATA_SCENA_ELEMENT_ID, EDITOR_CSS } from '@/widgets/Customizator/Editor/consts';
import {
  useCurrentTool,
  useEventBus,
  useHistoryManager,
  useTargetsManager,
  useViewportManager,
} from '@/widgets/Customizator/Editor/hooks';
import { useEffectInit } from '@/widgets/Customizator/Editor/hooks/useEffectInit/useEffectInit';
import { useKeyManager } from '@/widgets/Customizator/Editor/hooks/useKeyManager/useKeyManager';
import { Tabs } from '@/widgets/Customizator/Editor/Tabs/Tabs';
import { MoveTool } from '@/widgets/Customizator/Editor/tools';
import {
  checkBlur,
  getScreenWidth,
  onBlur,
  onResize,
  prefix,
} from '@/widgets/Customizator/Editor/utils';
import { removeProperties } from '@/widgets/Customizator/Editor/utils/MoveableHelper';
import { getAccurateAgent } from '@egjs/agent';
import Guides from '@scena/react-guides';

import type { EditorType } from '@/widgets/Customizator/Editor/types';
type PropTypes = {
  type: EditorType;
};

const EditorElement = styled('div', EDITOR_CSS);

export const Editor = ({ type }: PropTypes) => {
  const [isLoading, setIsLoading] = useState(true);
  const viewport = useRef<Viewport>(null);
  const selecto = useRef<Selecto>(null);
  const verticalGuides = useRef<Guides>(null);
  const horizontalGuides = useRef<Guides>(null);
  const moveable = useRef<Moveable>(null);

  const targetsManager = useTargetsManager();

  const eventBus = useEventBus();
  const toolManager = useCurrentTool(MoveTool);
  const viewportManager = useViewportManager();
  const [moveableHelper] = useState<MoveableHelper>(
    new MoveableHelper({
      createAuto: true,
      useBeforeRender: true,
    }),
  );

  const historyManager = useHistoryManager();

  const [isMacintosh, setIsMacintosh] = useState(false);

  const keyManager = useKeyManager();

  useEffectInit(
    isMacintosh,
    moveable,
    targetsManager,
    viewport,
    keyManager,
    moveableHelper,
    selecto,
    eventBus,
    historyManager,
    toolManager,
    verticalGuides,
    horizontalGuides,
  );

  useEffect(() => {
    const cropToolId = toolManager.selectedTool.id;
    const isCropToolChanged =
      cropToolId.startsWith('Crop') && cropToolId !== toolManager.selectedGroupTool?.id;
    if (!isCropToolChanged) return;
    removeProperties(viewport, moveableHelper, targetsManager, 'clip-path', 'clip');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolManager.selectedTool, toolManager.selectedGroupTool]);

  const [screenDimensions] = useState<{ width: number; height: number }>({
    width: getScreenWidth(type, 'mobile'),
    height: type === 'post' ? 400 : 844,
  });

  useEffect(() => {
    getAccurateAgent()
      ?.then((agent) => {
        setIsMacintosh(agent?.os.name === 'mac' || agent?.os.name === 'ios');
      })
      .catch((error) => {
        console.error(`Agent identification failed: ${error}`);
      });

    setIsLoading(false);

    return () => {
      eventBus.emitter.off();
      moveableHelper.clear();
      window.removeEventListener('resize', () => onResize(horizontalGuides, verticalGuides));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <div>Loading...</div>;

  const horizontalSnapGuides = [
    0,
    screenDimensions.height,
    screenDimensions.height / 2,
    ...viewportManager.viewportState.horizontalGuides,
  ];
  const verticalSnapGuides = [
    0,
    screenDimensions.width,
    screenDimensions.width / 2,
    ...viewportManager.viewportState.verticalGuides,
  ];
  const unit =
    viewportManager.viewportState.zoom < 0.8
      ? Math.floor(1 / viewportManager.viewportState.zoom) * 50
      : 50;

  return (
    <div className="app">
      <EditorElement className="relative h-screen w-screen flex flex-col items-center justify-center">
        <Tabs
          selectedTool={toolManager.selectedTool}
          setSelectedTool={toolManager.setSelectedTool}
          editorType={type}
          targetsManager={targetsManager}
          moveableHelper={moveableHelper}
          viewportRef={viewport}
          moveable={moveable}
          toolManager={toolManager}
          eventBus={eventBus}
          historyManager={historyManager}
          selecto={selecto}
        />
        <Toolbar
          selectedTool={toolManager.selectedTool}
          setSelectedTool={toolManager.setSelectedTool}
          editorType={type}
          targetsManager={targetsManager}
          moveableHelper={moveableHelper}
          viewportRef={viewport}
          moveable={moveable}
          toolManager={toolManager}
          eventBus={eventBus}
          historyManager={historyManager}
          selecto={selecto}
        />
        <Guides
          ref={horizontalGuides}
          type="horizontal"
          className={prefix('guides', 'horizontal')}
          style={{}}
          snapThreshold={5}
          snaps={horizontalSnapGuides}
          displayDragPos={true}
          dragPosFormat={(v) => `${v}px`}
          zoom={viewportManager.viewportState.zoom}
          unit={unit}
          onChangeGuides={(e) => {
            viewportManager.setViewportState((values) => ({
              ...values,
              horizontalGuides: e.guides,
            }));
          }}
        />
        <Guides
          ref={verticalGuides}
          type="vertical"
          className={prefix('guides', 'vertical')}
          style={{}}
          snapThreshold={5}
          snaps={verticalSnapGuides}
          displayDragPos={true}
          dragPosFormat={(v) => `${v}px`}
          zoom={viewportManager.viewportState.zoom}
          unit={unit}
          onChangeGuides={(e) => {
            viewportManager.setViewportState((values) => ({
              ...values,
              verticalGuides: e.guides,
            }));
          }}
        ></Guides>
        <div className="relative h-screen w-screen flex flex-col items-center justify-center scena-viewer">
          <Viewport
            ref={viewport}
            onBlur={(e: any) => onBlur(e, viewport, historyManager)}
            style={{ width: `${screenDimensions.width}px`, height: `${screenDimensions.height}px` }}
          >
            {targetsManager.selectedTargets.length ? (
              <MoveableManager
                selectedTargets={targetsManager.selectedTargets}
                selectedMenu={toolManager.selectedTool}
                verticalGuidelines={verticalSnapGuides}
                horizontalGuidelines={horizontalSnapGuides}
                zoom={viewportManager.viewportState.zoom}
                moveableHelper={moveableHelper}
                moveable={moveable}
                isShift={keyManager.keycon.shiftKey}
                eventBus={eventBus}
                historyManager={historyManager}
                clipPath={toolManager.toolProperties.get('crop')}
                viewportRef={viewport}
                selecto={selecto}
                targetsManager={targetsManager}
                toolManager={toolManager}
              />
            ) : (
              <Moveable
                ref={moveable}
                //rotatable={true}
                target={viewport.current ? viewport.current.viewportRef.current : null}
                origin={false}
                onRotateStart={moveableHelper.onRotateStart}
                onRotate={moveableHelper.onRotate}
              />
            )}
          </Viewport>
        </div>
        <Selecto
          ref={selecto}
          getElementRect={getElementInfo}
          dragContainer={'.scena-viewport'}
          hitRate={0}
          selectableTargets={[`.scena-viewport [${DATA_SCENA_ELEMENT_ID}]`]}
          selectByClick={true}
          selectFromInside={false}
          toggleContinueSelect={['shift']}
          preventDefault={true}
          onDragStart={(e) => {
            const inputEvent = e.inputEvent;
            const target = inputEvent.target;
            checkBlur(eventBus);
            if (
              (inputEvent.type === 'touchstart' && e.isTrusted) ||
              moveable.current?.isMoveableElement(target) ||
              targetsManager.selectedTargets.some((t) => t === target || t?.contains(target))
            ) {
              e.stop();
            }
          }}
          onSelectEnd={({ isDragStart, selected, inputEvent, rect }) => {
            if (isDragStart) {
              inputEvent.preventDefault();
            }
            toolManager.selectedTool.selectEndHandler?.(
              rect,
              viewport,
              selecto,
              targetsManager,
              viewportManager,
              toolManager,
              moveableHelper,
              eventBus,
              historyManager,
              selected,
              isDragStart,
              inputEvent,
              moveable,
            );
          }}
        />
      </EditorElement>
    </div>
  );
};
