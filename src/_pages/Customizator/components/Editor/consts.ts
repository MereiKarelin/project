import { ChosenWidgets } from '@/_pages/Customizator/components/Editor/types';
import { widgets } from '@/_pages/Customizator/consts';
import { Widget } from '@/_pages/Customizator/types';

const widgetArray = Object.entries(widgets)
  .filter((entry) => {
    const widget = entry[1] as unknown as Widget;
    return !widget.isRequired;
  })
  .map((entry) => [entry[0], { widget: entry[1], count: 0 }]);

export const selectableWidgets: ChosenWidgets = Object.fromEntries(widgetArray);
