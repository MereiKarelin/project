import { DATA_SCENA_ELEMENT_ID } from '@/_pages/Customizator/consts';
import { Errors, Widget } from '@/_pages/Customizator/types';
import { Link } from '@/entities';
import { LinkData } from '@/entities/Link/types';
import {
  getBtnElement,
  getCaptionElement,
  getIconElement,
  getUrlElement,
} from '@/entities/Link/utils';
import { UploadedFile } from '@/shared/types';
import { isUrlValid } from '@/shared/utils';
import { IObject } from '@daybrush/utils';

import { convertCssStringToStyleObject } from '../../utils';

const parseEditorContent = (element: HTMLElement) => {
  const newLink = document.createElement('a');

  const btnLink = getBtnElement(element);
  newLink.style.cssText = btnLink?.style.cssText ?? '';

  const urlElement = getUrlElement(element);
  let url = urlElement?.innerText ?? '';
  if (url && !url.startsWith('http')) {
    url = `https://${url}`;
  }
  newLink.href = url;

  const captionElement = getCaptionElement(element);
  if (captionElement) {
    const spanLink = document.createElement('span');
    spanLink.innerText = captionElement?.innerText ?? '';
    spanLink.style.cssText = captionElement?.style.cssText ?? '';
    spanLink.classList.add('btn-link-caption');
    newLink.appendChild(spanLink);
  }

  const iconElement = getIconElement(element);
  if (iconElement) {
    const iconLink = document.createElement('div');
    iconLink.innerText = ' ';
    iconLink.classList.add('btn-link-icon');
    newLink.appendChild(iconLink);
  }

  const newDiv = document.createElement('div');
  newDiv.appendChild(newLink);

  return newDiv.innerHTML ?? '';
};

const parseBackendContent = (element: HTMLElement) => {
  const link = element.children?.[0] as HTMLAnchorElement;
  const captionElement = getCaptionElement(element);
  const iconElement = getIconElement(element);
  const data = {
    linkStyle: convertCssStringToStyleObject(link?.style.cssText ?? ''),
    caption: {
      text: captionElement?.innerText,
      style: convertCssStringToStyleObject(captionElement?.style.cssText ?? ''),
    },
    isIconEnabled: !!iconElement,
    url: link.href,
  };
  return data;
};

export const LinkWidget: Widget = {
  id: 'WidgetLink',
  name: 'Link',
  isRequired: false,
  isFunctional: true,
  isContentEditable: true,
  isWidgetCustomizable: true,
  isCustomBackground: true,
  maxCount: 5,
  style: {
    position: 'absolute',
    'border-radius': '24px',
  },
  Component: ({
    isPalleteVersion = true,
    isEditable = false,
    data,
    props,
  }: {
    isPalleteVersion?: boolean;
    isEditable?: boolean;
    data?: IObject<any>;
    props?: IObject<any>;
  }) => {
    const linkData = data as LinkData;
    return (
      <Link
        isPalleteVersion={isPalleteVersion}
        isEditable={isEditable}
        data={linkData}
        {...props}
      />
    );
  },
  bodyType: 'RoundRect',
  parseWidgetContent: (element: HTMLElement, from: 'Editor' | 'Backend') => {
    if (from === 'Editor') {
      return parseEditorContent(element);
    }
    if (from === 'Backend') {
      return parseBackendContent(element);
    }

    return '';
  },
  validate: (element: HTMLElement) => {
    const errors: Errors = {};
    const url = getUrlElement(element)?.innerText;
    const caption = getCaptionElement(element)?.innerText;
    if (!url) {
      errors['data'] = `В виджете ссылка (${caption}) не задан url`;
    }

    if (!isUrlValid(url)) {
      errors['data'] = `В виджете ссылка (${caption}) не правильный url: ${url}`;
    }
    return errors;
  },
  setBGImage: (imgFile: UploadedFile | undefined, targetId: string) => {
    const src = imgFile?.src;

    const target = document.querySelector<HTMLElement>(`[${DATA_SCENA_ELEMENT_ID}="${targetId}"]`);
    if (target) {
      const linkButton = target.getElementsByClassName('btn-link')?.[0] as HTMLElement;
      if (linkButton) {
        linkButton.style.backgroundImage = src ? `url(${src})` : 'none';
      }
    }
  },
  getBGElement: (id: string) => {
    const target = document.querySelector<HTMLElement>(`[${DATA_SCENA_ELEMENT_ID}="${id}"]`);
    if (!target) return;

    return target.getElementsByClassName('btn-link')?.[0] as HTMLElement;
  },
};
