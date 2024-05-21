import '@/_pages/Customizator/components/Editor/App.css';
import '@/_pages/Customizator/style.css';

import classNames from 'classnames';
import { Body, System } from 'detect-collisions';
import MoveableHelper from 'moveable-helper';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Moveable, { getElementInfo } from 'react-moveable';
import Selecto from 'react-selecto';

import { MoveableManager, Toolbar, Viewport } from '@/_pages/Customizator/components';
import { BgImagePopup } from '@/_pages/Customizator/components/Editor/BgImagePopup/BgImagePopup';
import { ChangeBackground } from '@/_pages/Customizator/components/Editor/ChangeBackground';
import { selectableWidgets } from '@/_pages/Customizator/components/Editor/consts';
import { ChosenWidget, ChosenWidgets } from '@/_pages/Customizator/components/Editor/types';
import { checkForErrors } from '@/_pages/Customizator/components/Editor/utils';
import { WidgetPallete } from '@/_pages/Customizator/components/Editor/WidgetPallete';
import { SaveDialog } from '@/_pages/Customizator/components/SaveDialog/SaveDialog';
import { DATA_SCENA_ELEMENT_ID, viewModes, widgets } from '@/_pages/Customizator/consts';
import {
  useCurrentTool,
  useEventBus,
  useHistoryManager,
  useTargetsManager,
  useViewportManager,
} from '@/_pages/Customizator/hooks';
import { useEffectInit } from '@/_pages/Customizator/hooks/useEffectInit/useEffectInit';
import { useKeyManager } from '@/_pages/Customizator/hooks/useKeyManager/useKeyManager';
import { MoveTool } from '@/_pages/Customizator/tools';
import {
  addWidgetInfoToCanvas,
  appendJSXs,
  checkBlur,
  getId,
  initRequiredWidgets,
  isWidgetId,
  loadTargets,
  onBlur,
  onResize,
  parseWidgetType,
  prefix,
  saveHtmlTemplate,
  saveProfileBackgroundImage,
  updateProfileTemplate,
} from '@/_pages/Customizator/utils';
import {
  removeElements,
  removeProperties,
  setSelectedTargets,
} from '@/_pages/Customizator/utils/MoveableHelper';
import {
  highlightCollidedBody,
  isTargetOutside,
} from '@/_pages/Customizator/utils/MoveableManager';
import { IProfile } from '@/entities/Profile';
import { useAuth } from '@/features';
import { getProfileTemplateHandler } from '@/shared/api/profile';
import { GhostIcon } from '@/shared/assets/icons';
import { viewportSizes } from '@/shared/consts';
import { Direction, UploadedFile } from '@/shared/types';
import { Button } from '@/shared/ui/ButtonNew';
import { changeBackground, extractTemplateHTML, getCurrentProfile } from '@/shared/utils';
import { getAccurateAgent } from '@egjs/agent';
import Guides from '@scena/react-guides';

import type {
  CollisionBodies,
  DOMDirections,
  EditorType,
  ElementInfo,
  ViewMode,
  WidgetId,
} from '@/_pages/Customizator/types';
type PropTypes = {
  editorType: EditorType;
  viewMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
  isDeselectAllTargets: boolean;
  setIsDeselectAllTargets: Dispatch<SetStateAction<boolean>>;
  isPalleteOpen: boolean;
  isMobilePalleteOpen: boolean;
  setIsPalleteOpen: Dispatch<SetStateAction<boolean>>;
  id?: string;
};

export const EditingArea = ({
  id,
  editorType,
  viewMode,
  setViewMode,
  isDeselectAllTargets,
  setIsDeselectAllTargets,
  isPalleteOpen,
  setIsPalleteOpen,
  isMobilePalleteOpen,
}: PropTypes) => {
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

  const [selectedWidgets, setSelectedWidgets] = useState<ChosenWidgets>(selectableWidgets);
  const [bgImage, setBgImage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ [id: string]: UploadedFile }>({});
  const [isSaveModelOpen, setIsSaveModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

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

  const [screenDimensions] = useState<{ width: number; height: number }>({
    ...viewportSizes[editorType],
  });

  const [userProfile, setUserProfile] = useState<IProfile | null>(null);

  const [isSubMenuShown, setIsSubMenuShown] = useState(false);
  const initialized = useRef(false);
  const [collisionBodies, setCollisionBodies] = useState<CollisionBodies>({});
  const [collisionSystem] = useState<System<Body>>(new System());

  const [subMenuPosition, setSubMenuPosition] = useState<{
    offset: { [key in Direction]?: number };
    position: Direction;
  }>({
    offset: { left: 0, right: 0, top: 0, bottom: 0 },
    position: 'horizontalCenter',
  });

  const [isBgImagePopupOpen, setIsBgImagePopupOpen] = useState(false);
  const { executeQueryCallback } = useAuth();

  useEffect(() => {
    if (!viewport.current || !userProfile) return;

    const initTemplate = () => {
      if (!id) return;

      executeQueryCallback(async (accessToken: string) => {
        let response;
        if (editorType === 'profile') {
          response = await getProfileTemplateHandler(id, accessToken);
        } else {
          //TODO: add post profile template loading
        }
        if (!response) return;

        if (response.background_url) {
          changeBackground(response.background_url);
          setBgImage(response.background_url);
        }

        const initialHtml = await extractTemplateHTML(response.mobile_url);

        await loadTargets(
          initialHtml,
          userProfile,
          viewport,
          moveableHelper,
          targetsManager,
          historyManager,
          selecto,
          eventBus,
          setSelectedWidgets,
          collisionSystem,
          setCollisionBodies,
        );
      });
    };

    //workaround strict mode loading component twice in dev mode
    if (!initialized.current) {
      initialized.current = true;
      if (id) {
        //existing template being edited
        void initTemplate();
      } else {
        //new template being created
        if (editorType === 'profile') {
          void initRequiredWidgets(
            userProfile,
            viewport,
            moveableHelper,
            targetsManager,
            historyManager,
            selecto,
            eventBus,
            collisionSystem,
            setCollisionBodies,
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewport.current]);

  useEffect(() => {
    getAccurateAgent()
      ?.then((agent) => {
        setIsMacintosh(agent?.os.name === 'mac' || agent?.os.name === 'ios');
      })
      .catch((error) => {
        console.error(`Agent identification failed: ${error}`);
      });

    setIsLoading(false);

    const profile = getCurrentProfile();

    if (profile) {
      setUserProfile(profile);
    }

    return () => {
      eventBus.emitter.off();
      moveableHelper.clear();
      window.removeEventListener('resize', () => onResize(horizontalGuides, verticalGuides));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isDeselectAllTargets) {
      targetsManager.setSelectedTargets([]);
      setIsDeselectAllTargets(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeselectAllTargets]);

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

  const selectedTool =
    toolManager.selectedTool.type === 'tool' ? toolManager.selectedTool : undefined;

  const subMenuStyle = () => {
    const horizontal = !['left', 'topLeft', 'bottomLeft'].includes(subMenuPosition.position)
      ? {
          left: `${subMenuPosition.offset.left}px`,
        }
      : {
          right: `${subMenuPosition.offset.right}px`,
          bottom: `${subMenuPosition.offset.bottom}px`,
        };

    const vertical = subMenuPosition.offset.bottom
      ? { bottom: `${subMenuPosition.offset.bottom}px` }
      : subMenuPosition.offset.top
        ? { top: `${subMenuPosition.offset.top}px` }
        : {};

    return { ...horizontal, ...vertical };
  };

  const handleSaveClick = () => {
    //do not allow multiple fetch queries to be sent

    const errors = checkForErrors();
    let isError = false;
    if (Object.values(errors).length > 0) {
      alert('Шаблон не может быть сохранен');
      alert(Object.values(errors).join('\n'));
      isError = true;
    }

    if (collisionSystem.checkAll(() => true)) {
      alert('Шаблон не может быть сохранен, на канвасе имеются объекты наложенные друг на друга');
      for (const entry of Object.entries(collisionBodies)) {
        const [id, item] = entry;
        highlightCollidedBody(collisionSystem, id, item.body);
      }
      isError = true;
    }

    if (isError) return;

    if (editorType === 'profile') {
      if (!id) {
        setIsSaveModalOpen(true);
        return;
      }
      //do not allow multiple fetch queries to be sent
      if (isSaving) return;

      try {
        executeQueryCallback(async (accessToken: string) => {
          setIsSaving(true);
          const template = await updateProfileTemplate(id, uploadedFiles, accessToken);
          if (template && uploadedFiles[bgImage]) {
            const bgImageChanged = !!uploadedFiles[bgImage].file;
            if (bgImageChanged) {
              await saveProfileBackgroundImage(
                template.reference,
                bgImage,
                uploadedFiles,
                accessToken,
              );
            }
          }
          alert('Шаблон сохранен');
          void router.push('/id', { scroll: false });
        });
      } catch (error) {
        alert('Шаблон не может быть сохранен');
        console.error(`Template save failed: ${error}`);
      }
      setIsSaving(false);
      return;
    }

    //save post
    if (isSaving) return;
    try {
      executeQueryCallback(async (accessToken: string) => {
        setIsSaving(true);
        await saveHtmlTemplate(editorType, uploadedFiles, accessToken);
        alert('Пост сохранен');
        void router.push('/feed', { scroll: false });
      });
    } catch (error) {
      alert('Пост не может быть сохранен');
      console.error(`Template save failed: ${error}`);
    }
    setIsSaving(false);
  };

  const addWidgetToCanvas = (item: ChosenWidget) => {
    const widget = item.widget;
    const id =
      widget.maxCount > 1 ? `${widget.id}${Math.floor(Math.random() * 100000000)}` : widget.id;
    const type = widget.id;

    const widgetCount = selectedWidgets[widget.id]?.count ?? 0;
    if (widgetCount >= widget.maxCount) {
      alert(
        `Нельзя добавить виджет. Максимальное количество виджетов ${type} на канвасе равно ${widget.maxCount}`,
      );
      return;
    }

    const element = {
      jsx: (
        <widget.Component
          profile={userProfile}
          isScaled={false}
          isPalleteVersion={false}
          props={{ style: widget.style, 'data-scena-element-id': id }}
          isEditable={true}
        />
      ),
      attrs: [],
      name: widget.name,
      scopeId: 'viewport',
      frame: widget.style,
      id: id,
    } as ElementInfo;

    const appendWidgetJSX = (element: ElementInfo) =>
      appendJSXs(
        [element],
        viewport,
        moveableHelper,
        targetsManager,
        historyManager,
        selecto,
        eventBus,
      );

    void addWidgetInfoToCanvas(
      element,
      appendWidgetJSX,
      viewport,
      collisionSystem,
      setCollisionBodies,
    );

    setSelectedWidgets((prev) => ({
      ...prev,
      [widget.id]: { count: widgetCount + 1, widget },
    }));
  };

  const removePaletteWidgetFromCanvas = (id: string) => {
    if (!isWidgetId(id)) return;

    const widgetType = parseWidgetType(id) as WidgetId;
    const widget = widgets[widgetType];

    if (widget.isRequired) return;

    const widgetCount = selectedWidgets[widgetType]?.count ?? 0;

    if (widgetCount < 1) {
      console.error(`Wrong number of ${widgetType} widgets on canvas: ${widgetCount}`);
      return;
    }

    setSelectedWidgets((prev) => ({ ...prev, [widgetType]: { count: widgetCount - 1, widget } }));
  };

  const handleMoveableDelete = (id: string) => {
    removePaletteWidgetFromCanvas(id);

    const filteredCollisionBodies = { ...collisionBodies };
    const targets = targetsManager.selectedTargets;
    targets.forEach((target) => {
      const targetId = getId(target);
      if (targetId) {
        const body = collisionBodies[targetId];
        if (body) {
          collisionSystem.remove(body.body);
          delete filteredCollisionBodies[targetId];
        }
      }
    });
    setCollisionBodies(() => ({ ...filteredCollisionBodies }));

    return removeElements(
      targetsManager.selectedTargets,
      viewport,
      moveableHelper,
      targetsManager,
      historyManager,
      selecto,
      eventBus,
    );
  };

  return (
    <div className="flex flex-col gap-3 p-5 h-full">
      <div className="relative flex flex-row justify-between z-10">
        <WidgetPallete
          editorType={editorType}
          selectedWidgets={selectedWidgets}
          addWidgetToCanvas={(item: ChosenWidget) => addWidgetToCanvas(item)}
          isPalleteOpen={isPalleteOpen}
          setIsPalleteOpen={setIsPalleteOpen}
        />
        <div className={classNames(isMobilePalleteOpen && 'hidden')}>
          <Button color="secondary" textColor="secondary" size="s" disabled>
            <GhostIcon width={24} />
            <span className="hidden sm:inline">Превью</span>
          </Button>
        </div>
        {!(isMobilePalleteOpen || editorType === 'post') && (
          <div className={classNames(isMobilePalleteOpen && 'hidden')}>
            <ChangeBackground
              editorType={editorType}
              bgImage={bgImage}
              setBgImage={setBgImage}
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
            />
          </div>
        )}
      </div>
      <div id="editingArea" className="h-full relative flex flex-row justify-center items-center">
        <div className="absolute bottom-0 left-0 hidden lg:flex flex-col justify-between gap-3 z-10">
          <span className="font-bold">Вид просмотра:</span>
          <div className="flex flex-col 2xl:flex-row gap-3">
            {viewModes.map((mode) => (
              <Button
                key={mode.id}
                textColor="secondary"
                color={viewMode !== mode.id ? 'disabled' : 'primary'}
                size="s"
                onClick={() => {
                  setViewMode(mode.id);
                }}
              >
                {mode.name}
              </Button>
            ))}
          </div>
        </div>
        <div className="w-full h-full flex flex-col gap-5 items-center">
          <div
            className="relative grow w-full rounded-3xl flex flex-col items-center justify-center scena-viewer"
            onClick={() => {
              if (toolManager.selectedTool.type === 'tab') {
                toolManager.setSelectedTool(() => ({ ...MoveTool }));
                toolManager.setSelectedToolGroup(undefined);

                setIsSubMenuShown(false);
              }
            }}
          >
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
            />
            <Viewport
              ref={viewport}
              onBlur={(e: any) => onBlur(e, viewport, historyManager)}
              style={{
                width: `${screenDimensions.width}px`,
                height: `${screenDimensions.height}px`,
              }}
            >
              {targetsManager.selectedTargets.length ? (
                <MoveableManager
                  selectedTargets={targetsManager.selectedTargets}
                  selectedMenu={selectedTool}
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
                  toolManager={toolManager}
                  collisionBodies={collisionBodies}
                  setCollisionBodies={setCollisionBodies}
                  collisionSystem={collisionSystem}
                  setIsSubMenuShown={setIsSubMenuShown}
                  setSubMenuPosition={setSubMenuPosition}
                  handleChangeImage={() => setIsBgImagePopupOpen(true)}
                  onDelete={(id: string) => handleMoveableDelete(id)}
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
            <Selecto
              ref={selecto}
              getElementRect={getElementInfo}
              dragContainer={'.scena-viewport'}
              hitRate={0}
              selectableTargets={[`.scena-viewport [${DATA_SCENA_ELEMENT_ID}]`]}
              selectByClick={true}
              selectFromInside={!selectedTool?.id.startsWith('Move')}
              toggleContinueSelect={['shift']}
              preventDefault={true}
              onDragStart={(e) => {
                const inputEvent = e.inputEvent;
                const target = inputEvent.target;

                if (selectedTool?.id.startsWith('Text') && target.isContentEditable) {
                  e.stop();
                  setSelectedTargets([target], targetsManager, historyManager, selecto, eventBus);
                  eventBus.requestTrigger('setSelectedTargets');
                }
                checkBlur(eventBus);
              }}
              onDragEnd={() => {
                const target = targetsManager?.selectedTargets?.[0];
                const targetRect = target?.getBoundingClientRect();
                const viewportRect = document
                  .getElementsByClassName('scena-viewport-container')?.[0]
                  .getBoundingClientRect();

                const isOutside = isTargetOutside(viewportRect, targetRect);

                //move target back to viewport if it is outside
                const requester = moveable.current?.request('draggable');

                Object.keys(isOutside).forEach((key) => {
                  const direction = key as DOMDirections;

                  const position = isOutside[direction];
                  if (position) {
                    if (['left', 'right'].includes(direction)) {
                      requester?.request({
                        deltaX: position - targetRect[direction],
                        deltaY: 0,
                      });
                    } else {
                      requester?.request({
                        deltaX: 0,
                        deltaY: position - targetRect[direction],
                      });
                    }
                  }
                });
                requester?.requestEnd();
              }}
              onSelectEnd={({ isDragStart, selected, inputEvent, rect }) => {
                if (isDragStart) {
                  inputEvent.preventDefault();
                }
                selectedTool?.selectEndHandler?.(
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
                  setCollisionBodies,
                  collisionSystem,
                );
              }}
            />
          </div>
          <Toolbar
            editorType={editorType}
            setIsSubMenuShown={setIsSubMenuShown}
            toolManager={toolManager}
            setSubMenuPosition={setSubMenuPosition}
            handleSaveClick={handleSaveClick}
            isVisible={!isMobilePalleteOpen}
          />
        </div>
        {isSubMenuShown &&
          toolManager.selectedToolGroup &&
          toolManager.selectedTool.type === 'tool' && (
            <div
              className={classNames(
                'absolute p-1 z-20 shadow-lg bg-white rounded-tl-3xl rounded-tr-3xl flex flex-col items-center',
                subMenuPosition.position === 'horizontalCenter' &&
                  'rounded-bl-3xl rounded-br-3xl items-center',
                subMenuPosition.position === 'left' && 'rounded-bl-3xl',
                subMenuPosition.position === 'right' && 'rounded-br-3xl',
              )}
              onClick={(e) => {
                setIsSubMenuShown(false);
                e.stopPropagation();
              }}
              style={subMenuStyle()}
            >
              <div className="flex flex-row items-center gap-2">
                {toolManager.selectedToolGroup.tools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={(e) => {
                      toolManager.setSelectedTool(tool);
                      removeProperties(
                        viewport,
                        moveableHelper,
                        targetsManager,
                        'clip-path',
                        'clip',
                      );
                      if (tool.type === 'tab') {
                        //stop propagation to let sub menu stay open
                        e.stopPropagation();
                      }
                    }}
                    className="h-8 w-8 flex items-center justify-center"
                  >
                    {tool.icon?.()}
                  </div>
                ))}
              </div>
            </div>
          )}

        {isSubMenuShown &&
          toolManager.selectedTool.Component &&
          toolManager.selectedTool.type === 'tab' && (
            <div
              className={classNames(
                'absolute z-20 shadow-lg bg-white rounded-3xl flex flex-col items-center gap-3 p-3',
                subMenuPosition.position === 'horizontalCenter' &&
                  'rounded-bl-3xl rounded-br-3xl items-center',
                subMenuPosition.position === 'left' && 'rounded-bl-0',
                subMenuPosition.position === 'right' && 'rounded-br-0',
              )}
              style={subMenuStyle()}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-sm font-bold">{toolManager.selectedTool.title}</h2>
              <toolManager.selectedTool.Component
                setIsSubMenuShown={setIsSubMenuShown}
                editorType={editorType}
                viewMode={viewMode}
                setViewMode={setViewMode}
                targetsManager={targetsManager}
                moveableHelper={moveableHelper}
                viewportRef={viewport}
                moveable={moveable}
                toolManager={toolManager}
                eventBus={eventBus}
                historyManager={historyManager}
                selecto={selecto}
                setUploadedFiles={setUploadedFiles}
              />
            </div>
          )}
      </div>
      <SaveDialog
        editorType={editorType}
        isModalOpen={isSaveModelOpen}
        setIsModalOpen={setIsSaveModalOpen}
        bgImage={bgImage}
        uploadedFiles={uploadedFiles}
      />
      <BgImagePopup
        isClosed={!isBgImagePopupOpen}
        handleClose={(close: boolean) => setIsBgImagePopupOpen(!close)}
        target={targetsManager.selectedTargets?.[0]}
        setUploadedFiles={setUploadedFiles}
        uploadedFiles={uploadedFiles}
      />
    </div>
  );
};
