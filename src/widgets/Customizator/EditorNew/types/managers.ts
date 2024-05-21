import { IObject } from '@/widgets/Customizator/EditorNew/types';

export type HistoryAction = {
  type: string;
  props: IObject<any>;
  description?: string;
};

export type HistoryType =
  | 'createElements'
  | 'removeElements'
  | 'selectTargets'
  | 'changeText'
  | 'move'
  | 'render'
  | 'renders';

export type HistoryActionAction = 'history.redo' | 'history.undo' | 'history.add';

export type ActionEvent = {
  inputEvent?: Event;
  stopLog(): void;
  [key: string]: any;
};

export type ActionEvents = {
  [key: string]: ActionEvent;
};
