import { Widget, WidgetId } from '@/_pages/Customizator/types';

export type ChosenWidget = { widget: Widget; count: number };
export type ChosenWidgets = { [key in WidgetId]?: ChosenWidget };
