import { widgets } from '@/_pages/Customizator/consts';
import { isWidgetId, parseWidgetType } from '@/_pages/Customizator/utils';

export const checkForErrors = () => {
  const viewportElem = document.getElementsByClassName('scena-viewport')?.[0] as HTMLElement;
  let errors: { [key: string]: string } = {};

  for (const item of viewportElem.children) {
    const dataScenaElementId = item.getAttribute('data-scena-element-id');
    if (isWidgetId(dataScenaElementId)) {
      const element = item as HTMLElement;
      const type = parseWidgetType(dataScenaElementId);
      const widget = widgets[type];

      const widgetErrors = widget.validate?.(element);
      if (widgetErrors) {
        errors = { ...errors, ...widgetErrors };
      }
    }
  }

  return errors ?? { error: `Неправильный url: ${'ссылка'}` };
};
