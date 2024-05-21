import { prefixNames } from 'framework-utils';
import MoveableHelper from 'moveable-helper';
import React, { RefObject } from 'react';
import Moveable, { getElementInfo } from 'react-moveable';
import Selecto from 'react-selecto';
import { Frame } from 'scenejs';
import { T } from 'vitest/dist/reporters-5f784f42';

import { extractDivContent } from '@/entities/Customization/utils/utils';
import { createCustomizedPostHandler } from '@/shared/api/post';
import { createProfileTemplateHandler } from '@/shared/api/profile';
import { Viewport } from '@/widgets/Customizator/Editor/components';
import { DATA_SCENA_ELEMENT_ID, PREFIX } from '@/widgets/Customizator/Editor/consts';
import {
  ElementInfo,
  SavedScenaData,
  ScenaComponent,
  ScenaFunctionComponent,
  ScenaFunctionJSXElement,
  ScenaJSXElement,
  ScenaProps,
  ViewMode,
} from '@/widgets/Customizator/Editor/types';
import {
  appendComplete,
  removeFrames,
  setMoveableProperty,
} from '@/widgets/Customizator/Editor/utils/MoveableHelper';
import { restoreFrames } from '@/widgets/Customizator/Editor/utils/RestoreActions';
import { IObject, isArray, isFunction, isObject, splitComma } from '@daybrush/utils';
import { fromTranslation, matrix3d } from '@scena/matrix';
import Guides from '@scena/react-guides';

import type {
  EditorType,
  EventBus,
  HistoryManager,
  MovedInfo,
  MovedResult,
  TargetsManager,
} from '@/widgets/Customizator/Editor/types';
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

export const makeScenaFunctionComponent = (
  id: string,
  component: (props: ScenaProps & IObject<any>) => React.ReactElement<any, any>,
): ScenaFunctionComponent<T> => {
  (component as ScenaFunctionComponent<IObject<any>>).scenaComponentId = id;

  return component as ScenaFunctionComponent<IObject<any>>;
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

export const updateElements = (infos: ElementInfo[]) => {
  return infos.map(function registerElement(info) {
    const id = info.id;

    const target = document.querySelector<HTMLElement>(`[${DATA_SCENA_ELEMENT_ID}="${id}"]`);
    if (!target) return;

    const attrs = info.attrs || {};

    info.el = target;

    for (const name in attrs) {
      target?.setAttribute(name, attrs[name]);
    }

    info.attrs = getScenaAttrs(target);
    const children = info.children || [];

    if (children.length) {
      children.forEach(registerElement);
    } else if (info.attrs.contenteditable) {
      if ('innerText' in info) {
        target.innerText = info.innerText || '';
      } else {
        info.innerText = target.innerText || '';
      }
    } else if (!info.componentId) {
      if ('innerHTML' in info) {
        target.innerHTML = info.innerHTML || '';
      } else {
        info.innerHTML = target.innerHTML || '';
      }
    }
    return { ...info };
  });
};

export const saveHtmlTemplate = async (
  type: EditorType,
  templateName?: string,
  containerId?: string,
  classNameContainerId = 'scena-viewport',
  accessToken = '',
) => {
  const setEditableFalse = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    doc.querySelectorAll('[contenteditable="true"]').forEach((element) => {
      element.setAttribute('contenteditable', 'false');
    });
    return doc.body.innerHTML;
  };

  if (type == 'profile' && templateName) {
    if (templateName.trim() === '') {
      return; // Don't proceed if the templateName is empty
    }
    try {
      if (containerId) {
        const html = extractDivContent(containerId);

        if (html?.contentHTML) {
          const updatedHTML = setEditableFalse(html.contentHTML);
          await createProfileTemplateHandler(
            templateName,
            updatedHTML,
            updatedHTML,
            updatedHTML,
            accessToken,
          );
        }
      } else {
        const html = extractDivContent(undefined, classNameContainerId);
        if (html?.contentHTML) {
          await createProfileTemplateHandler(
            templateName,
            html?.contentHTML,
            html?.contentHTML,
            html?.contentHTML,
            accessToken,
          );
        }
      }

      // alert('Шаблоны могут отличаться на разных девайсах!');
    } catch (err) {
      console.error(err);
      alert('Заполните кастомизацию для всех девайсов!');
    }
  } else if (type == 'post') {
    try {
      const template = extractDivContent(undefined, classNameContainerId);
      if (template !== null) {
        const updatedHTML = setEditableFalse(template.contentHTML);
        await createCustomizedPostHandler(updatedHTML, updatedHTML, updatedHTML, accessToken);
      }
    } catch (err) {
      console.error(err);
      alert('Заполните кастомизацию для всех девайсов!');
    }
  }
};

export const getScreenWidth = (editorType: EditorType, screen: ViewMode): number => {
  if (screen === 'PC') {
    return editorType === 'post' ? 600 : 1025;
  } else if (screen === 'tablet') {
    return editorType === 'post' ? 554 : 768;
  } else {
    //mobile screen
    return editorType === 'post' ? 514 : 465;
  }
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
  const appendIndex = !isRestore && indexes?.length ? indexes[indexes.length - 1] + 1 : -1;

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
  blob: Blob,
  viewportRef: RefObject<Viewport>,
  moveableHelper: MoveableHelper,
  targetsManager: TargetsManager,
  historyManager: HistoryManager,
  selecto: RefObject<Selecto>,
  eventBus: EventBus,
) => {
  const url = URL.createObjectURL(blob);

  const elements = [
    {
      jsx: <img src={url} alt="appended blob" />,
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
  const frameMap = removeFrames(
    movedInfos.map(({ info }) => info.el!),
    viewportRef,
    moveableHelper,
  );
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
