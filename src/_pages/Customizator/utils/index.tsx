import { Body, System } from 'detect-collisions';
import { prefixNames } from 'framework-utils';
import MoveableHelper from 'moveable-helper';
import { Dispatch, ReactNode, RefObject, SetStateAction, createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Moveable, { getElementInfo } from 'react-moveable';
import Selecto from 'react-selecto';
import { Frame } from 'scenejs';

import { Viewport } from '@/_pages/Customizator/components';
import { ChosenWidgets } from '@/_pages/Customizator/components/Editor/types';
import {
  DATA_SCENA_ELEMENT_ID,
  PREFIX,
  widgets,
  widgetsProfile,
} from '@/_pages/Customizator/consts';
import { createBody, parseFloatTranslateProps } from '@/_pages/Customizator/tools/handlers';
import {
  ElementInfo,
  SavedScenaData,
  ScenaComponent,
  ScenaFunctionJSXElement,
  ScenaJSXElement,
} from '@/_pages/Customizator/types';
import {
  appendComplete,
  removeFrames,
  setMoveableProperty,
  setSelectedTargets,
} from '@/_pages/Customizator/utils/MoveableHelper';
import { highlightCollidedBody } from '@/_pages/Customizator/utils/MoveableManager';
import { restoreFrames } from '@/_pages/Customizator/utils/RestoreActions';
import { extractDivContent, extractImgSourcesHTML } from '@/entities/Customization/utils/utils';
import { IProfile } from '@/entities/Profile';
import { uploadImageHandler } from '@/shared/api/file';
import { createCustomizedPostHandler } from '@/shared/api/post';
import {
  createProfileTemplateHandler,
  setProfileTemplateBackgroundHandler,
  updateProfileTemplateHandler,
} from '@/shared/api/profile';
import { UploadedFile } from '@/shared/types';
import { toCamelCase } from '@/shared/utils';
import {
  addSizeInfoToHtml,
  dropWidgetDetailsFromHtml,
  setEditableAttribute,
} from '@/shared/utils/customizator';
import { updateTransformOrigin } from '@/shared/utils/html';
import { IObject, isArray, isFunction, isObject, splitComma } from '@daybrush/utils';
import { fromTranslation, matrix3d } from '@scena/matrix';
import Guides from '@scena/react-guides';

import type {
  EditorType,
  EventBus,
  HistoryManager,
  MovedInfo,
  MovedResult,
  SetCollisionBodies,
  TargetsManager,
  WidgetId,
} from '@/_pages/Customizator/types';
export const prefix = (...classNames: string[]) => {
  return prefixNames(PREFIX, ...classNames);
};
export const getContentElement = (el: HTMLElement): HTMLElement | null => {
  if (el.contentEditable === 'inherit' && el.parentElement) {
    return getContentElement(el.parentElement);
  }
  if (el.contentEditable === 'true') {
    return el;
  }
  return null;
};

export const between = (val: number, min: number, max: number) => {
  return Math.min(Math.max(min, val), max);
};

export const getId = (el: HTMLElement | SVGElement) => {
  return el?.getAttribute(DATA_SCENA_ELEMENT_ID);
};
export const getIds = (els: Array<HTMLElement | SVGElement>): string[] => {
  return els.map((el) => getId(el)).filter((el) => el !== null) as string[];
};

export const isElementEditableText = (target: HTMLElement | SVGElement) => {
  const tagName = target.tagName.toLowerCase();

  return (target as HTMLElement).isContentEditable || ['input', 'textarea'].includes(tagName);
};
export const checkImageLoaded = (el: HTMLElement | SVGElement): Promise<any> => {
  if (el.tagName.toLowerCase() !== 'img') {
    return Promise.all([].slice.call(el.querySelectorAll('img')).map((el) => checkImageLoaded(el)));
  }
  return new Promise((resolve) => {
    if ((el as HTMLImageElement).complete) {
      resolve(undefined);
    } else {
      el.addEventListener('load', function loaded() {
        resolve(undefined);

        el.removeEventListener('load', loaded);
      });
    }
  });
};

export const getParentScenaElement = (
  el: HTMLElement | SVGElement,
): HTMLElement | SVGElement | null => {
  if (!el) {
    return null;
  }
  if (el.hasAttribute(DATA_SCENA_ELEMENT_ID)) {
    return el;
  }
  return getParentScenaElement(el.parentElement as HTMLElement | SVGElement);
};

export const getScenaAttrs = (el: HTMLElement | SVGElement) => {
  const attributes = el.attributes;
  const length = attributes.length;
  const attrs: IObject<any> = {};

  for (let i = 0; i < length; ++i) {
    const { name, value } = attributes[i];

    if (name === DATA_SCENA_ELEMENT_ID || name === 'style') {
      continue;
    }
    attrs[name] = value;
  }

  return attrs;
};

export const isScenaFunction = (value: any): value is ScenaComponent => {
  return isFunction(value) && 'scenaComponentId' in value;
};

export const isScenaElement = (value: any): value is ScenaJSXElement => {
  return isObject(value) && !isScenaFunction(value);
};
export const isScenaFunctionElement = (value: any): value is ScenaFunctionJSXElement => {
  return isScenaElement(value) && isFunction(value.type);
};

export const setMoveMatrix = (frame: Frame, moveMatrix: number[]) => {
  const transformOrders = [...(frame.getOrders(['transform']) || [])];

  if (`${transformOrders[0]}`.indexOf('matrix3d') > -1) {
    const matrix = frame.get('transform', transformOrders[0]);
    const prevMatrix = isArray(matrix) ? matrix : splitComma(matrix).map((v) => parseFloat(v));

    frame.set('transform', transformOrders[0], matrix3d(moveMatrix, prevMatrix));
  } else if (frame.has('transform', 'matrix3d')) {
    let num = 1;
    while (frame.has('transform', `matrix3d${++num}`)) {}

    frame.set('transform', `matrix3d${num}`, [...moveMatrix]);
    frame.setOrders(['transform'], [`matrix3d${num}`, ...transformOrders]);
  } else {
    frame.set('transform', 'matrix3d', [...moveMatrix]);
    frame.setOrders(['transform'], ['matrix3d', ...transformOrders]);
  }
};

export const getOffsetOriginMatrix = (el: HTMLElement | SVGElement, container: HTMLElement) => {
  const stack = getElementInfo(el, container);
  const origin = stack.targetOrigin;
  const translation = fromTranslation([origin[0], origin[1], origin[2] || 0], 4);

  return matrix3d(stack.offsetMatrix as any, translation);
};

export const updateElements = (infos: ElementInfo[]) =>
  infos.map((info) => {
    const id = info.id;

    const target = document.querySelector<HTMLElement>(`[${DATA_SCENA_ELEMENT_ID}="${id}"]`);
    if (!target) return {} as ElementInfo;

    const attrs = info.attrs || {};

    info.el = target;

    for (const name in attrs) {
      target?.setAttribute(name, attrs[name]);
    }

    info.attrs = getScenaAttrs(target);
    const children = info.children || [];
    let appendedChildren: ElementInfo[] = [];

    if (children.length) {
      appendedChildren = updateElements(children);
    } else if (info.attrs.contenteditable) {
      if ('innerText' in info) {
        target.innerText = info.innerText || '';
      } else {
        info.innerText = target.innerText || '';
      }
      // } else if ('innerText' in info && info.innerText) {
      // target.innerText = info.innerText;
    } else if (!info.componentId) {
      if ('innerHTML' in info) {
        target.innerHTML = info.innerHTML || '';
      } else {
        info.innerHTML = target.innerHTML || '';
      }
    }
    info.children = appendedChildren;
    return { ...info };
  });

export const uploadTemplateImages = (
  imgSrcs: string[],
  uploadedFiles: {
    [id: string]: UploadedFile;
  },
  accessToken: string,
) => {
  if (!imgSrcs?.length) return;

  return Promise.all(
    imgSrcs.map((src) => {
      const uploadedFile = uploadedFiles[src];
      if (!uploadedFile) return;
      const formData = new FormData();
      const file = uploadedFile.file as File;
      formData.append('name', file.name);
      formData.append('file', file);
      return uploadImageHandler(formData, accessToken);
    }),
  );
};

export const uploadAndReplaceTemplateImageUrls = async (
  html: string,
  uploadedFiles: { [id: string]: UploadedFile },
  accessToken: string,
) => {
  if (!html) return '';

  const imgSrcs = extractImgSourcesHTML(html);
  const responses = await uploadTemplateImages(imgSrcs, uploadedFiles, accessToken);

  let updatedHTML = html;
  for (let i = 0; i < imgSrcs.length; i++) {
    const oldUrl = imgSrcs[i];
    if (!uploadedFiles[oldUrl]) continue;

    const newUrl = responses?.[i]?.url;
    updatedHTML = updatedHTML.replace(oldUrl, newUrl);
  }
  return updatedHTML;
};

export const saveProfileBackgroundImage = (
  referemce: string,
  bgImage: string,
  uploadedFiles: {
    [id: string]: UploadedFile;
  },
  accessToken: string,
) => {
  const uploadedFile = uploadedFiles[bgImage];
  if (!uploadedFile) return;

  const file = uploadedFile.file as File;
  return setProfileTemplateBackgroundHandler(referemce, file, accessToken);
};

export const saveHtmlTemplate = async (
  type: EditorType,
  uploadedFiles: {
    [id: string]: UploadedFile;
  },
  accessToken: string,
  templateName?: string,
  containerId?: string,
  classNameContainerId = 'scena-viewport',
) => {
  if (!containerId && !classNameContainerId) return;

  const html = containerId
    ? extractDivContent(containerId)
    : extractDivContent(undefined, classNameContainerId);

  if (!html?.contentHTML) return;

  html['contentHTML'] = await uploadAndReplaceTemplateImageUrls(
    html?.contentHTML ?? '',
    uploadedFiles,
    accessToken,
  );

  let updatedHTML = setEditableAttribute(html.contentHTML, false);
  updatedHTML = addSizeInfoToHtml(updatedHTML);
  updatedHTML = dropWidgetDetailsFromHtml(updatedHTML);
  updatedHTML = removeMatrix3DFromHTML(updatedHTML);

  try {
    if (type == 'profile' && templateName) {
      return templateName.trim() === ''
        ? undefined
        : createProfileTemplateHandler(
            templateName,
            updatedHTML,
            updatedHTML,
            updatedHTML,
            accessToken,
          );
    } else if (type == 'post') {
      return createCustomizedPostHandler(updatedHTML, updatedHTML, updatedHTML, accessToken);
    }
  } catch (err) {
    console.error(err);
  }
};

export const updateProfileTemplate = async (
  reference: string,
  uploadedFiles: {
    [id: string]: UploadedFile;
  },
  accessToken: string,
  containerId?: string,
  classNameContainerId = 'scena-viewport',
) => {
  if (!containerId && !classNameContainerId) return;

  const html = containerId
    ? extractDivContent(containerId)
    : extractDivContent(undefined, classNameContainerId);

  if (!html?.contentHTML) return;

  html['contentHTML'] = await uploadAndReplaceTemplateImageUrls(
    html?.contentHTML ?? '',
    uploadedFiles,
    accessToken,
  );

  let updatedHTML = setEditableAttribute(html.contentHTML, false);
  updatedHTML = addSizeInfoToHtml(updatedHTML);
  updatedHTML = dropWidgetDetailsFromHtml(updatedHTML);
  updatedHTML = removeMatrix3DFromHTML(updatedHTML);

  try {
    return updateProfileTemplateHandler(
      reference,
      updatedHTML,
      updatedHTML,
      updatedHTML,
      accessToken,
    );
  } catch (err) {
    console.error(err);
  }
};

export const isWidgetId = (id: string | undefined | null) => {
  return id ? id.toLocaleLowerCase().startsWith('widget') : false;
};

export const getWidget = (target: HTMLElement) => {
  if (!target) return;
  const id = getId(target);
  if (!isWidgetId(id)) return;
  const type = parseWidgetType(id);
  return widgets[type];
};

const getAppendIndex = (
  newInfos: ElementInfo[],
  infos: ElementInfo[] | undefined,
  fallbackIndex: number,
) => {
  if (newInfos.length > 1) return fallbackIndex;
  const first = newInfos[0];
  if (!first || !infos) return -1;

  if (isWidgetId(first.id)) {
    return infos?.length ?? -1;
  }

  let firstNonWidgetId = 0;

  for (const info of infos) {
    if (isWidgetId(info.id)) {
      return firstNonWidgetId;
    }

    firstNonWidgetId += 1;
  }

  return firstNonWidgetId;
};

export const appendJSXs = (
  jsxs: ElementInfo[],
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
  targetsManager: TargetsManager,
  historyManager: HistoryManager,
  selecto: RefObject<Selecto>,
  eventBus: EventBus,
  isRestore?: boolean,
): Promise<Array<HTMLElement | SVGElement>> | undefined => {
  const viewport = viewportRef.current;
  if (!viewport) return;

  const indexesList = viewport.getSortedIndexesList(targetsManager.selectedTargets);

  const indexes = indexesList.length ? indexesList[indexesList.length - 1] : undefined;
  const info = indexes?.length ? viewport.getInfoByIndexes(indexes) : undefined;
  const scopeId = !isRestore && info ? info.scopeId : '';
  const fallbackIndex = !isRestore && indexes?.length ? indexes[indexes.length - 1] + 1 : -1;
  const infos = viewportRef.current.getViewportInfos();
  const appendIndex = getAppendIndex(jsxs, infos, fallbackIndex);

  return viewport.appendJSXs(jsxs, appendIndex, scopeId).then(({ added }) => {
    return appendComplete(
      added,
      viewportRef,
      moveableHelper,
      targetsManager,
      historyManager,
      selecto,
      eventBus,
      isRestore,
    );
  });
};

export const moveOutside = (
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
  targetsManager: TargetsManager,
  historyManager: HistoryManager,
  selecto: RefObject<Selecto>,
  eventBus: EventBus,
) => {
  let targets = targetsManager.selectedTargets;

  const viewport = viewportRef.current;
  if (targets.length !== 1 || !viewport) {
    return;
  }
  targets = [targets[0]];

  const frameMap = removeFrames(targets, viewportRef, moveableHelper);
  if (!frameMap) return;

  viewport
    .moveOutside(targets[0])
    .then((result) =>
      moveComplete(
        result,
        frameMap,
        viewportRef,
        moveableHelper,
        targetsManager,
        historyManager,
        selecto,
        eventBus,
      ),
    )
    .catch((error) => console.error(`Moving outside failed: ${error}`));
};

export const moveInside = (
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
  targetsManager: TargetsManager,
  historyManager: HistoryManager,
  selecto: RefObject<Selecto>,
  eventBus: EventBus,
) => {
  let targets = targetsManager.selectedTargets;
  const viewport = viewportRef.current;

  const length = targets.length;
  if (length !== 1 || !viewport) {
    return;
  }
  targets = [targets[0]];

  const frameMap = removeFrames(targets, viewportRef, moveableHelper);
  if (!frameMap) return;

  return viewport
    .moveInside(targets[0])
    .then((result) =>
      moveComplete(
        result,
        frameMap,
        viewportRef,
        moveableHelper,
        targetsManager,
        historyManager,
        selecto,
        eventBus,
      ),
    );
};

export const appendBlob = (
  url: string,
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
  targetsManager: TargetsManager,
  historyManager: HistoryManager,
  selecto: RefObject<Selecto>,
  eventBus: EventBus,
) => {
  const elements = [
    {
      jsx: <img src={url} alt="(Image)" style={{ position: 'absolute' }} />,
      name: '(Image)',
    },
  ] as ElementInfo[];
  return appendJSXs(
    elements,
    viewportRef,
    moveableHelper,
    targetsManager,
    historyManager,
    selecto,
    eventBus,
  )?.then((targets) => targets[0]);
};

export const moves = (
  movedInfos: MovedInfo[],
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
  targetsManager: TargetsManager,
  historyManager: HistoryManager,
  selecto: RefObject<Selecto>,
  eventBus: EventBus,
  isRestore?: boolean,
) => {
  const elements = movedInfos.map(({ info }) => info.el).filter((el) => el) as HTMLElement[];
  const frameMap = removeFrames(elements, viewportRef, moveableHelper);
  const viewport = viewportRef.current;

  if (!frameMap) return;

  return viewport
    ?.moves(movedInfos)
    .then((result) =>
      moveComplete(
        result,
        frameMap,
        viewportRef,
        moveableHelper,
        targetsManager,
        historyManager,
        selecto,
        eventBus,
        isRestore,
      ),
    );
};

export const moveComplete = async (
  result: MovedResult,
  frameMap: IObject<any>,
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
  targetsManager: TargetsManager,
  historyManager: HistoryManager,
  selecto: RefObject<Selecto>,
  eventBus: EventBus,
  isRestore?: boolean,
) => {
  const { prevInfos, nextInfos } = result;

  restoreFrames(nextInfos, frameMap, viewportRef, moveableHelper);

  if (nextInfos.length) {
    if (!isRestore) {
      historyManager.addAction('move', {
        prevInfos,
        nextInfos,
      });
    }
    await appendComplete(
      nextInfos.map(({ info, moveMatrix }) => {
        return {
          ...info,
          moveMatrix,
        };
      }),
      viewportRef,
      moveableHelper,
      targetsManager,
      historyManager,
      selecto,
      eventBus,
      true,
    );
  }

  return result;
};

export const setProperty = (
  scope: string[],
  value: any,
  viewportRef: RefObject<Viewport>,
  moveable: RefObject<Moveable>,
  targetsManager: TargetsManager,
  moveableHelper: MoveableHelper,
  eventBus: EventBus,
  historyManager: HistoryManager,
  isUpdate?: boolean,
) => {
  const infos = setMoveableProperty(scope, value, viewportRef, moveableHelper, targetsManager);

  historyManager.addAction('renders', { infos });

  if (isUpdate) {
    moveable.current?.updateRect();
  }
  eventBus.requestTrigger('render');
};

export const onBlur = (
  e: any,
  viewportRef: RefObject<Viewport>,
  historyManager: HistoryManager,
) => {
  const target = e.target as HTMLElement | SVGElement;
  const viewport = viewportRef.current;

  if (!isElementEditableText(target) || !viewport) {
    return;
  }
  const parentTarget = getParentScenaElement(target);

  if (!parentTarget) {
    return;
  }
  const info = viewport.getInfoByElement(parentTarget);

  if (!info?.attrs?.contenteditable) {
    return;
  }
  const nextText = (parentTarget as HTMLElement).innerText;

  if (info.innerText === nextText) {
    return;
  }
  historyManager.addAction('changeText', {
    id: info.id,
    prev: info.innerText,
    next: nextText,
  });
  info.innerText = nextText;
};

export const move = (deltaX: number, deltaY: number, moveable: RefObject<Moveable>) => {
  moveable.current?.request('draggable', { deltaX, deltaY }, true);
};

export const onResize = (
  horizontalGuides: RefObject<Guides>,
  verticalGuides: RefObject<Guides>,
) => {
  horizontalGuides.current?.resize();
  verticalGuides.current?.resize();
};

export const checkBlur = (eventBus: EventBus) => {
  const activeElement = document.activeElement;
  if (activeElement) {
    (activeElement as HTMLElement).blur();
  }
  const selection = document.getSelection();

  if (selection) {
    selection.removeAllRanges();
  }
  eventBus.emitter.trigger('blur');
};

export const saveTargets = (
  targets: Array<HTMLElement | SVGElement>,
  viewport: RefObject<Viewport>,
  moveableData: MoveableHelper,
) => {
  return targets
    .map((target) => viewport.current?.getInfoByElement(target))
    .map(function saveTarget(info): SavedScenaData {
      const target = info?.el;
      const isContentEditable = info?.attrs?.contenteditable;
      if (!target) {
        return {
          attrs: {},
          componentId: '',
          frame: {},
          jsxId: '',
          name: '',
          tagName: '',
          innerHTML: '',
          innerText: '',
          children: [],
        };
      }

      return {
        name: info.name,
        attrs: getScenaAttrs(target),
        jsxId: info.jsxId || '',
        componentId: info.componentId ?? '',
        innerHTML: isContentEditable ? '' : target?.innerHTML,
        innerText: isContentEditable ? target?.innerText : '',
        tagName: target?.tagName.toLowerCase() ?? '',
        frame: moveableData.getFrame(target).get(),
        children: info.children?.map(saveTarget) ?? [],
      };
    });
};

export const copyDomRectToStyle = (styleRecepient: { [key: string]: string }, domRect: DOMRect) => {
  const newStyle = { ...styleRecepient };
  if (!domRect) return newStyle;

  const domProps = domRect as unknown as { [key: string]: number };

  Object.keys(domProps).forEach((key: string) => {
    newStyle[key] = `${domProps[key]}px`;
  });

  return newStyle;
};

export const parseWidgetType = (id: string | null) => {
  const regex = /^[a-zA-Z]+/;

  const match = id?.match(regex);
  return match ? match[0] : '';
};

export const addWidgetInfoToCanvas = async (
  element: ElementInfo,
  addWidgetJSX: (element: ElementInfo) => Promise<(SVGElement | HTMLElement)[]> | undefined,
  viewportRef: RefObject<Viewport>,
  collisionSystem: System<Body>,
  setCollisionBodies: SetCollisionBodies,
) => {
  const targets = await addWidgetJSX(element);

  const viewportRect = viewportRef?.current?.viewportRef.current?.getBoundingClientRect();

  targets?.forEach((target) => {
    if (!viewportRect) return;
    const targetRect = getRelativeBoundingRect(target.getBoundingClientRect(), viewportRect);

    const id = getId(target);
    const type = parseWidgetType(id);
    if (type) {
      const widget = widgets[type];
      const bodyType = widget?.bodyType;

      if (bodyType) {
        if (!targetRect) return;

        const widget = widgets[type];
        if (!widget) return;

        const { translateX, translateY } = parseFloatTranslateProps(
          widget.style,
          bodyType,
          viewportRect,
          targetRect,
        );

        const initRect = { ...targetRect, translateX, translateY };

        const body = createBody(bodyType, initRect, widget.style, collisionSystem);
        if (body && id) {
          setCollisionBodies((bodies) => ({
            ...bodies,
            [id]: { body, initRect },
          }));
          highlightCollidedBody(collisionSystem, id, body);
        }
      }
    }
  });
};

const initializeCollisionBodies = (
  targets: (HTMLElement | SVGElement)[] | undefined,
  viewportRef: RefObject<Viewport>,
  collisionSystem: System<Body>,
  setCollisionBodies: SetCollisionBodies,
) => {
  if (!targets || !viewportRef?.current) return;

  const viewportRect = viewportRef?.current.viewportRef.current?.getBoundingClientRect();

  targets?.forEach((target) => {
    if (!viewportRect) return;
    const targetRect = getRelativeBoundingRect(target.getBoundingClientRect(), viewportRect);

    const targetElement = target as HTMLElement;
    const id = getId(target);
    const type = parseWidgetType(id);

    if (id && type) {
      const widget = widgets[type];
      const bodyType = widget?.bodyType;

      if (bodyType) {
        if (!targetRect) return;

        const widget = widgets[type];
        if (!widget) return;

        const style = convertCssStringToStyleObject(targetElement.style.cssText);

        const { translateX, translateY } = parseFloatTranslateProps(
          style,
          bodyType,
          viewportRect,
          targetRect,
        );

        const initRect = { ...targetRect, translateX, translateY };

        const body = createBody(bodyType, initRect, widget.style, collisionSystem);
        if (body && id) {
          setCollisionBodies((bodies) => ({
            ...bodies,
            [id]: { body, initRect },
          }));
        }
      }
    }
  });
};

export const initRequiredWidgets = async (
  userProfile: IProfile | null,
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
  targetsManager: TargetsManager,
  historyManager: HistoryManager,
  selecto: RefObject<Selecto>,
  eventBus: EventBus,
  collisionSystem: System<Body>,
  setCollisionBodies: SetCollisionBodies,
) => {
  const viewport = viewportRef.current;
  if (!viewport) return;
  const elements = widgetsProfile
    .filter((widget) => widget.isRequired)
    .map((widget) => {
      const element = {
        jsx: <widget.Component profile={userProfile} isScaled={false} />,
        attrs: [],
        name: widget.name,
        scopeId: 'viewport',
        frame: widget.style,
        id: widget.id,
      } as ElementInfo;
      return element;
    });

  const targets = await appendJSXs(
    elements,
    viewportRef,
    moveableHelper,
    targetsManager,
    historyManager,
    selecto,
    eventBus,
  );

  initializeCollisionBodies(targets, viewportRef, collisionSystem, setCollisionBodies);

  setSelectedTargets([targets?.[0]], targetsManager, historyManager, selecto, eventBus);
};

export const loadChildrenElementsInfo = (
  children: HTMLCollection,
  list?:
    | {
        [key: string]: JSX.Element;
      }
    | undefined,
) => {
  if (!children.length) return [];

  const savedElements: ElementInfo[] = [];
  for (const child of children) {
    const item = child as HTMLElement;
    const attributes: { [key: string]: string } = {};
    for (let i = 0; i < item.attributes.length; i++) {
      const attrib = item.attributes[i];
      attributes[attrib.name] = attrib.value;
    }

    const style = convertCssStringToCssObject(attributes.style);

    const jsxId = getId(item);
    const jsx = jsxId ? list?.[jsxId] : undefined;
    const isWidget = isWidgetId(jsxId);

    let nextChildren: ElementInfo[] | undefined = undefined;
    if (!isWidget) {
      nextChildren = loadChildrenElementsInfo(item.children);
    }

    const savedElement = {
      jsx: isWidget ? jsx : item.tagName.toLowerCase(),
      attrs: attributes,
      name: item.getAttribute('alt') ?? item.getAttribute(DATA_SCENA_ELEMENT_ID) ?? '',
      frame: { ...style },
      scopeId: 'viewport',
      id: jsxId,
      innerText: isWidget ? undefined : nextChildren?.length ? undefined : item.innerText,
      children: nextChildren,
    } as ElementInfo;

    savedElements.push(savedElement);
  }

  return savedElements;
};

export const loadTargets = async (
  initialHtml: string,
  userProfile: IProfile | null,
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
  targetsManager: TargetsManager,
  historyManager: HistoryManager,
  selecto: RefObject<Selecto>,
  eventBus: EventBus,
  setSelectedWidgets: Dispatch<SetStateAction<ChosenWidgets>>,
  collisionSystem: System<Body>,
  setCollisionBodies: SetCollisionBodies,
) => {
  const viewport = viewportRef.current;
  if (!viewport || !initialHtml) return;

  const jsx = parseJSXElements(initialHtml, userProfile, true, true);
  const updatedHtml = renderToStaticMarkup(<>{jsx?.markup}</>);
  const html = setEditableAttribute(updatedHtml, true);

  const parser = new DOMParser();
  const htmlDom = parser.parseFromString(html, 'text/html');

  const viewportElement = htmlDom.getElementsByClassName('scena-viewport')?.[0];

  if (viewportElement?.children.length) {
    const savedElements: ElementInfo[] = loadChildrenElementsInfo(
      viewportElement.children,
      jsx?.list,
    );

    if (savedElements?.length) {
      await appendJSXs(
        savedElements,
        viewportRef,
        moveableHelper,
        targetsManager,
        historyManager,
        selecto,
        eventBus,
      )?.then((targets) => {
        initializeCollisionBodies(targets, viewportRef, collisionSystem, setCollisionBodies);

        const selectableWidgets = {} as ChosenWidgets;
        for (const target of targets) {
          const element = target as HTMLElement;
          const id = getId(element);
          if (isWidgetId(id)) {
            const type = parseWidgetType(id);
            const widget = widgets[type];
            if (!widget.isRequired) {
              const selectableWidget = selectableWidgets[widget.id];
              selectableWidgets[widget.id] = {
                widget,
                count: (selectableWidget?.count ?? 0) + 1,
              };
            }
          }
        }
        setSelectedWidgets((state) => ({ ...state, ...selectableWidgets }));
        setSelectedTargets([targets[0]], targetsManager, historyManager, selecto, eventBus);
      });
    }
  }
};

/**
 * convert css string to css object
 * @param cssString : string, e.g. "width: 291px; height: 185px; transform: translate(87px, 2px) rotate(0deg) scale(1, 1);"
 * @returns object with key-value pairs, in the given example it will be: { width: '291px', height: '185px', transform: 'translate(87px, 2px) rotate(0deg) scale(1, 1)'}
 */
export const convertCssStringToCssObject = (cssString: string) => {
  if (!cssString) return {};
  const cssProperties = cssString.split(';');

  const cssObject: { [key: string]: string } = {};

  // Iterate through each CSS property
  cssProperties.forEach((property) => {
    const keyValue = property.split(':');

    // If there are both key and value
    if (keyValue.length === 2) {
      // Trim any leading or trailing whitespace
      const key = keyValue[0].trim();
      const value = keyValue[1].trim();

      // Add the key-value pair to the object
      cssObject[key] = value;
    }
  });

  return cssObject;
};

/**
 * convert css string to css style object
 * @param cssString : string, e.g. "background-color: rgb(68, 170, 255); border-radius: 50%"
 * @returns object with key-value pairs, in the given example it will be: { backgroundColor: 'rgb(68, 170, 255)'; borderRadius: '50%'}
 */
export const convertCssStringToStyleObject = (cssString: string) => {
  if (!cssString) return {};

  const cssProperties = cssString.split(';');

  const cssObject: { [key: string]: string } = {};

  // Iterate through each CSS property
  cssProperties.forEach((property) => {
    const colonIndex = property.indexOf(':');

    // If there are both key and value
    if (colonIndex > -1) {
      // Trim any leading or trailing whitespace
      const key = toCamelCase(property.slice(0, colonIndex).trim());
      const value = property.slice(colonIndex + 1).trim();

      // Add the key-value pair to the object
      cssObject[key] = value;
    }
  });

  return cssObject;
};

/**
 *
 * @param user - user to initialize user related widgets
 * @returns jsx array including initialized widgets
 */
export const parseJSXElements = (
  templateHTML: string,
  profile: IProfile | null = null,
  isEditor = false,
  isEditable = false,
  viewportElementId = 'scena-viewport',
) => {
  if (!templateHTML || !viewportElementId) return;

  const propNameExceptions: { [key: string]: string } = {
    contenteditable: 'contentEditable',
    [DATA_SCENA_ELEMENT_ID]: DATA_SCENA_ELEMENT_ID,
  };

  const parser = new DOMParser();

  const doc = parser.parseFromString(templateHTML, 'text/html');
  const viewportElement = doc.getElementsByClassName(viewportElementId)?.[0] as HTMLElement;

  if (!viewportElement) return;

  const JSXs: JSX.Element[] = [];
  const widgetsList: { [key: string]: JSX.Element } = {};
  for (const item of viewportElement.children) {
    const element = item as HTMLElement;
    const id = getId(element);
    if (isWidgetId(id)) {
      const widgetId = id as WidgetId;
      const updatedStyle = updateTransformOrigin(element.style.cssText);
      const style = convertCssStringToStyleObject(updatedStyle ?? '');

      const type = parseWidgetType(id);
      const widget = widgets[type];
      const data = widget?.parseWidgetContent?.(element, 'Backend') as IObject<any>;
      const jsx = (
        <widget.Component
          profile={profile}
          key={id}
          isScaled={!isEditor}
          isPalleteVersion={false}
          isEditable={isEditable}
          props={{
            [DATA_SCENA_ELEMENT_ID]: id,
            onClick: isEditable ? undefined : widget.onClick,
            style,
          }}
          data={data}
        />
      );
      JSXs.push(jsx);
      widgetsList[widgetId] = jsx;
    } else {
      const props: IObject<any> = {};
      for (const attr of element.attributes) {
        if (attr.name.toLocaleLowerCase() === 'contenteditable' && !isEditable) {
          //do not copy this attribute, cause this may give rise to vulnerability
          continue;
        }
        const name = propNameExceptions[attr.name] ?? toCamelCase(attr.name);
        if (attr.name === 'style') {
          const updatedStyle = updateTransformOrigin(attr.value);
          const style = convertCssStringToStyleObject(updatedStyle);
          props[name] = style;
        } else {
          if (attr.name.toLocaleLowerCase() === 'contenteditable') {
            props['suppressContentEditableWarning'] = true;
          }
          props[name] = attr.value;
        }
      }

      props['key'] = id;
      const tagName = element.tagName.toLocaleLowerCase();
      let children: ReactNode[] | null = element.children.length === 0 ? [element.innerHTML] : [];
      if (tagName === 'img') {
        //img element can not have children
        children = null;
      }
      const jsx = createElement(tagName, props, children);
      JSXs.push(jsx);
    }
  }

  return {
    markup: (
      <div
        {...{
          [DATA_SCENA_ELEMENT_ID]: getId(viewportElement),
          className: Array.from(viewportElement.classList).join(' '),
          style: convertCssStringToStyleObject(viewportElement.style.cssText),
        }}
      >
        {JSXs}
      </div>
    ),
    list: widgetsList,
  };
};

export const getRelativeBoundingRect = (childRect: DOMRect, parentRect: DOMRect) => {
  if (!childRect || !parentRect) {
    return childRect;
  }
  const relativeRect = {
    x: childRect.x - parentRect.x + childRect.width / 2,
    y: childRect.y - parentRect.y + childRect.height / 2,
    width: childRect.width,
    height: childRect.height,
    top: childRect.top - parentRect.top,
    right: childRect.left - parentRect.left + childRect.width,
    bottom: childRect.top - parentRect.top + childRect.height,
    left: childRect.left - parentRect.left,
  } as DOMRect;

  return relativeRect;
};

export const removeMatrix3DFromHTML = (html: string) => {
  // Define a regular expression pattern to match matrix3d() function
  const pattern = /matrix3d\([^)]*\)/g;

  // Replace the matched pattern with an empty string
  return html.replace(pattern, '');
};

export const parseNumericStyleValue = (v: string | undefined) => {
  if (v?.endsWith('px')) {
    return parseFloat(v);
  }

  return 0;
};

export const setBGImage = (imgFile: UploadedFile | undefined, targetId: string) => {
  const src = imgFile?.src;

  const target = document.querySelector<HTMLElement>(`[${DATA_SCENA_ELEMENT_ID}="${targetId}"]`);
  if (target) {
    target.style.backgroundImage = src ? `url(${src})` : 'none';
  }
};
