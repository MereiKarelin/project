// @ts-nocheck
import { prefixNames } from 'framework-utils';
import React from 'react';
import { getElementInfo } from 'react-moveable';
import { Frame } from 'scenejs';

import { IObject, isArray, isFunction, isObject, splitComma } from '@daybrush/utils';
import { fromTranslation, matrix3d } from '@scena/matrix';

import { DATA_SCENA_ELEMENT_ID, PREFIX } from '../consts';
import {
  ElementInfo,
  ScenaComponent,
  ScenaFunctionComponent,
  ScenaFunctionJSXElement,
  ScenaJSXElement,
  ScenaProps,
} from '../types';

export function prefix(...classNames: string[]) {
  return prefixNames(PREFIX, ...classNames);
}
export function getContentElement(el: HTMLElement): HTMLElement | null {
  if (el.contentEditable === 'inherit') {
    return getContentElement(el.parentElement!);
  }
  if (el.contentEditable === 'true') {
    return el;
  }
  return null;
}

export function between(val: number, min: number, max: number) {
  return Math.min(Math.max(min, val), max);
}

export function getId(el: HTMLElement | SVGElement) {
  return el?.getAttribute(DATA_SCENA_ELEMENT_ID)!;
}
export function getIds(els: Array<HTMLElement | SVGElement>): string[] {
  return els.map((el) => getId(el));
}

export function checkInput(target: HTMLElement | SVGElement) {
  const tagName = target.tagName.toLowerCase();

  return (target as HTMLElement).isContentEditable || tagName === 'input' || tagName === 'textarea';
}
export function checkImageLoaded(el: HTMLElement | SVGElement): Promise<any> {
  if (el.tagName.toLowerCase() !== 'img') {
    return Promise.all([].slice.call(el.querySelectorAll('img')).map((el) => checkImageLoaded(el)));
  }
  return new Promise((resolve) => {
    if ((el as HTMLImageElement).complete) {
      resolve();
    } else {
      el.addEventListener('load', function loaded() {
        resolve();

        el.removeEventListener('load', loaded);
      });
    }
  });
}

export function getParnetScenaElement(
  el: HTMLElement | SVGElement,
): HTMLElement | SVGElement | null {
  if (!el) {
    return null;
  }
  if (el.hasAttribute(DATA_SCENA_ELEMENT_ID)) {
    return el;
  }
  return getParnetScenaElement(el.parentElement as HTMLElement | SVGElement);
}

export function makeScenaFunctionComponent<T = IObject<any>>(
  id: string,
  component: (props: ScenaProps & T) => React.ReactElement<any, any>,
): ScenaFunctionComponent<T> {
  (component as ScenaFunctionComponent<T>).scenaComponentId = id;

  return component as ScenaFunctionComponent<T>;
}

export function getScenaAttrs(el: HTMLElement | SVGElement) {
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
}

export function isScenaFunction(value: any): value is ScenaComponent {
  return isFunction(value) && 'scenaComponentId' in value;
}

export function isScenaElement(value: any): value is ScenaJSXElement {
  return isObject(value) && !isScenaFunction(value);
}
export function isScenaFunctionElement(value: any): value is ScenaFunctionJSXElement {
  return isScenaElement(value) && isFunction(value.type);
}

export function setMoveMatrix(frame: Frame, moveMatrix: number[]) {
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
}

export function getOffsetOriginMatrix(el: HTMLElement | SVGElement, container: HTMLElement) {
  const stack = getElementInfo(el, container);
  const origin = stack.targetOrigin;
  const translation = fromTranslation([origin[0], origin[1], origin[2] || 0], 4);

  return matrix3d(stack.offsetMatrix as any, translation);
}

export function updateElements(infos: ElementInfo[]) {
  return infos.map(function registerElement(info) {
    const id = info.id!;

    const target = document.querySelector<HTMLElement>(`[${DATA_SCENA_ELEMENT_ID}="${id}"]`)!;
    const attrs = info.attrs || {};

    info.el = target;

    for (const name in attrs) {
      target.setAttribute(name, attrs[name]);
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
}

type templateType = 'post' | 'profile';
// @ts-ignore
export const saveHtmlTemplate = async (
  type: templateType,
  templateName?: string,
  containerId?: string,
  classNameContainerId = 'scena-viewport',
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
          await createProfileTemplateHandler(templateName, updatedHTML, updatedHTML, updatedHTML);
        }
      } else {
        const html = extractDivContent(undefined, classNameContainerId);
        if (html?.contentHTML) {
          await createProfileTemplateHandler(
            templateName,
            html?.contentHTML,
            html?.contentHTML,
            html?.contentHTML,
          );
        }
      }

      // alert('Шаблоны могут отличаться на разных девайсах!');
    } catch (err) {
      console.log(err);
      alert('Заполните кастомизацию для всех девайсов!');
    }
  } else if (type == 'post') {
    try {
      const desktopData =
        window && window.localStorage.getItem(LOCALSTORAGE_ITEMS.CUSTOMIZATION_POST_DESKTOP);
      const tabletData =
        window && window.localStorage.getItem(LOCALSTORAGE_ITEMS.CUSTOMIZATION_POST_TABLET);
      const mobileData =
        window && window.localStorage.getItem(LOCALSTORAGE_ITEMS.CUSTOMIZATION_POST_MOBILE);

      const desktop = desktopData ? JSON.parse(desktopData) : null;
      const tablet = tabletData ? JSON.parse(tabletData) : null;
      const mobile = mobileData ? JSON.parse(mobileData) : null;

      let contentHTMLDesktop, contentHTMLTablet, contentHTMLMobile;

      if (desktop) {
        contentHTMLDesktop = desktop.customizationItem.contentHTML;
      }

      if (tablet) {
        contentHTMLTablet = tablet.customizationItem.contentHTML;
      }

      if (mobile) {
        contentHTMLMobile = mobile.customizationItem.contentHTML;
      }

      if (!desktop && !tablet && !mobile) {
        const template = extractDivContent(undefined, classNameContainerId);
        if (template !== null) {
          const updatedHTML = setEditableFalse(template.contentHTML);
          const res = await createCustomizedPostHandler(updatedHTML, updatedHTML, updatedHTML);
        }
      } else if (desktop) {
        const args = [desktop.customizationItem.contentHTML];

        if (tablet && mobile) {
          args.push(tablet.customizationItem.contentHTML, mobile.customizationItem.contentHTML);
        } else if (tablet) {
          args.push(tablet.customizationItem.contentHTML, tablet.customizationItem.contentHTML);
        } else if (mobile) {
          args.push(mobile.customizationItem.contentHTML, mobile.customizationItem.contentHTML);
        } else {
          args.push(desktop.customizationItem.contentHTML, desktop.customizationItem.contentHTML);
        }
        // @ts-ignore
        const res = await createCustomizedPostHandler(...args);
      }

      alert('Шаблоны могут отличаться на разных девайсах!');
      window && window.localStorage.removeItem(LOCALSTORAGE_ITEMS.CUSTOMIZATION_POST_DESKTOP);
      window && window.localStorage.removeItem(LOCALSTORAGE_ITEMS.CUSTOMIZATION_POST_TABLET);
      window && window.localStorage.removeItem(LOCALSTORAGE_ITEMS.CUSTOMIZATION_POST_MOBILE);
      window && window.localStorage.removeItem(LOCALSTORAGE_ITEMS.CUSTOMIZATION_SCREEN);
      window && window.localStorage.removeItem(LOCALSTORAGE_ITEMS.CUSTOMIZATION_SETTINGS);
    } catch (err) {
      console.log(err);
      alert('Заполните кастомизацию для всех девайсов!');
    }
  }
};
