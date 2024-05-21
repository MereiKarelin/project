import { DATA_SCENA_ELEMENT_ID, widgets } from '@/_pages/Customizator/consts';
import { isWidgetId, parseWidgetType } from '@/_pages/Customizator/utils';

export const setEditableAttribute = (htmlString: string, editable: boolean) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  doc.querySelectorAll(`[contenteditable="${(!editable).toString()}"]`).forEach((element) => {
    element.setAttribute('contenteditable', `${editable.toString()}`);
  });
  return doc.body.innerHTML;
};

export const dropWidgetDetailsFromHtml = (htmlString: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const viewportElem = doc.getElementsByClassName('scena-viewport')?.[0] as HTMLElement;

  for (const item of viewportElem.children) {
    const dataScenaElementId = item.getAttribute('data-scena-element-id');
    if (isWidgetId(dataScenaElementId)) {
      const oldDiv = item as HTMLElement;
      const newDiv = document.createElement('div');
      const type = parseWidgetType(dataScenaElementId);
      const widget = widgets[type];
      let htmlContent;
      if (widget.isContentEditable) {
        //the content is set by user and should be saved to server
        htmlContent = widget.parseWidgetContent?.(oldDiv, 'Editor') as string;
        newDiv.innerHTML = htmlContent ?? '';
      }

      newDiv.style.cssText = oldDiv.style.cssText;

      if (dataScenaElementId) {
        newDiv.setAttribute('data-scena-element-id', dataScenaElementId);
      }

      oldDiv.parentNode?.replaceChild(newDiv, oldDiv);
    }
  }

  return doc.body.innerHTML;
};

export const addSizeInfoToHtml = (htmlString: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const viewportElem = doc.getElementsByClassName('scena-viewport')?.[0] as HTMLElement;

  for (const item of viewportElem.children) {
    const dataScenaElementId = item.getAttribute('data-scena-element-id');
    const oldDiv = item as HTMLElement;

    const type = parseWidgetType(dataScenaElementId);
    const widget = widgets[type];

    //do not add width info in widgets that have children, because child div may overflow parent div, especially text
    const isWidgetHasNoSize = oldDiv.childElementCount > 0 && !widget?.isContentEditable;

    if (isWidgetId(dataScenaElementId) && isWidgetHasNoSize) continue;

    let newStyle = oldDiv.style.cssText;

    const target = document.querySelector<HTMLElement>(
      `[${DATA_SCENA_ELEMENT_ID}="${dataScenaElementId}"]`,
    );

    if (target) {
      if (!newStyle.match(/width:(.*?);/g)?.length) {
        newStyle = `${newStyle} width:${target.offsetWidth}px;`;
      } else {
        newStyle = newStyle.replace(/width:(.*?);/g, `width:${target.offsetWidth}px;`);
      }

      if (!newStyle.match(/height:(.*?);/g)?.length) {
        newStyle = `${newStyle} height:${target.offsetHeight}px;`;
      } else {
        newStyle = newStyle.replace(/height:(.*?);/g, `height:${target.offsetHeight}px;`);
      }
    }

    if (newStyle) oldDiv.style.cssText = newStyle;

    if (dataScenaElementId) {
      oldDiv.setAttribute('data-scena-element-id', dataScenaElementId);
    }
  }

  return doc.body.innerHTML;
};

export const getActiveWidgets = () => {
  const viewportElem = document.getElementsByClassName('scena-viewport')?.[0] as HTMLElement;

  const activeWidgets = [];

  for (const item of viewportElem.children) {
    const dataScenaElementId = item.getAttribute('data-scena-element-id');
    if (isWidgetId(dataScenaElementId)) {
      const type = parseWidgetType(dataScenaElementId);
      const widget = { widget: widgets[type], id: dataScenaElementId, type };
      activeWidgets.push(widget);
    }
  }

  return activeWidgets;
};

export const getActiveWidgetCounts = () => {
  const activeWidgets = getActiveWidgets();

  const widgetCounts: { [type: string]: number } = {};
  for (const item of activeWidgets) {
    const { type } = item;
    widgetCounts[type] = (widgetCounts[type] ?? 0) + 1;
  }
  return widgetCounts;
};
