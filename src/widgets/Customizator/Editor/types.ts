import KeyController from 'keycon';
import MoveableHelper from 'moveable-helper';
import { Dispatch, ReactNode, RefObject, SetStateAction } from 'react';
import Moveable from 'react-moveable';
import Selecto, { Rect } from 'react-selecto';

import { Viewport } from '@/widgets/Customizator/Editor/components';
import { IObject } from '@daybrush/utils';
import EventEmitter from '@scena/event-emitter';

export type ToolId =
  | 'Color'
  | 'Align'
  | 'Font'
  | 'Layers'
  | 'Text'
  | 'Save'
  | 'Image'
  | 'Undo'
  | 'Redo'
  | 'Move'
  | 'CropRect'
  | 'CropCircle'
  | 'CropEllipse'
  | 'CropPolygon'
  | 'CropToolGroup'
  | 'RoundRect'
  | 'Ellipse';

export type ClipPath = 'circle' | 'rect' | 'ellipse' | 'polygon';

export type Tool = {
  id: ToolId;
  type: 'tool' | 'tab';
  keys?: string[];
  icon: (selected?: boolean) => ReactNode;
  title: string;
  onClick?: (historyManager: HistoryManager) => void;
  Component?: ({
    selectedTool,
    setSelectedTool,
    editorType,
    targetsManager,
    moveableHelper,
    viewportRef,
    moveable,
    toolManager,
    eventBus,
    historyManager,
    selecto,
  }: {
    selectedTool: Tool;
    setSelectedTool: (tool: Tool) => void;
    editorType: EditorType;
    targetsManager: TargetsManager;
    moveableHelper: MoveableHelper;
    viewportRef: RefObject<Viewport>;
    moveable: RefObject<Moveable>;
    toolManager: ToolManager;
    eventBus: EventBus;
    historyManager: HistoryManager;
    selecto: RefObject<Selecto>;
  }) => ReactNode;
  elementProperties?: (toolProperties: ToolProperties) => {
    attrs: IObject<any>;
    style: IObject<any>;
  };
  selectEndHandler?: (
    rect: Rect,
    viewportRef: RefObject<Viewport>,
    selecto: RefObject<Selecto>,
    targetsManager: TargetsManager,
    viewportManager: ViewportManager,
    toolManager: ToolManager,
    moveableHelper: MoveableHelper,
    eventBus: EventBus,
    historyManager: HistoryManager,
    selected: (HTMLElement | SVGElement)[],
    isDragStart: boolean,
    inputEvent: any,
    moveable: RefObject<Moveable<object>>,
  ) => void;
  toolProperties?: { [name: string]: string }[];
};

export type ToolGroup = {
  id: ToolId;
  type: 'toolGroup';
  tools: Tool[];
};

export type ToolbarItem = Tool | ToolGroup;

export type ActionType =
  | 'createElements'
  | 'removeElements'
  | 'selectTargets'
  | 'changeText'
  | 'move'
  | 'render'
  | 'renders';

export type RestoreCallback = (props: any) => any;

export type KeyManager = {
  addKeyDownCallback: any;
  addKeyUpCallback: (keys: string[], callback: (e: any) => any, description?: any) => void;
  keys: [string[], string][];
  keycon: KeyController;
};

export type HistoryManager = {
  registerType: (type: ActionType, undo: RestoreCallback, redo: RestoreCallback) => void;
  addAction: (type: ActionType, props: IObject<any>) => void;
  undo: () => void;
  redo: () => void;
};

export type ToolProperties = {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
};

export type EventAction = 'setSelectedTargets' | 'render' | 'blur' | 'renderGroup';
export type EventBus = {
  emitter: EventEmitter<{
    [key: string]: {
      [key: string]: any;
    };
  }>;
  requestTrigger: (name: string, params?: IObject<any>) => void;
};

export type TargetsManager = {
  selectedTargets: (HTMLElement | SVGElement)[];
  setSelectedTargets: Dispatch<SetStateAction<(HTMLElement | SVGElement)[]>>;
};

export type ToolManager = {
  selectedTool: Tool;
  setSelectedTool: Dispatch<SetStateAction<Tool>>;
  selectedGroupTool: Tool | undefined;
  setSelectedGroupTool: Dispatch<SetStateAction<Tool | undefined>>;
  toolProperties: ToolProperties;
};

export type ViewportManager = {
  viewportState: {
    horizontalGuides: number[];
    verticalGuides: number[];
    zoom: number;
  };
  setViewportState: Dispatch<
    SetStateAction<{
      horizontalGuides: number[];
      verticalGuides: number[];
      zoom: number;
    }>
  >;
};

export interface SavedScenaData {
  name: string;
  jsxId: string;
  componentId: string;
  tagName: string;
  innerHTML?: string;
  innerText?: string;
  attrs: IObject<any>;
  frame: IObject<any>;
  children: SavedScenaData[];
}
export interface ScenaProps {
  scenaElementId?: string;
  scenaAttrs?: IObject<any>;
  scenaText?: string;
  scneaHTML?: string;
}

export type ScenaFunctionComponent<T> = ((
  props: T & ScenaProps,
) => React.ReactElement<any, any>) & { scenaComponentId: string };
export type ScenaComponent = React.JSXElementConstructor<ScenaProps> & { scenaComponentId: string };
export type ScenaJSXElement = React.ReactElement<any, string> | ScenaFunctionJSXElement;
export type ScenaFunctionJSXElement = React.ReactElement<any, ScenaComponent>;
export type ScenaJSXType = ScenaJSXElement | string | ScenaComponent;

export interface AddedInfo {
  added: ElementInfo[];
}
export interface RemovedInfo {
  removed: ElementInfo[];
}
export interface MovedInfo {
  info: ElementInfo;
  parentInfo: ElementInfo;
  prevInfo?: ElementInfo;
  moveMatrix?: number[];
}
export interface MovedResult {
  prevInfos: MovedInfo[];
  nextInfos: MovedInfo[];
}
export interface FrameInfo {
  frame: IObject<any>;
  order: IObject<any>;
}
export interface ElementInfo {
  jsx: ScenaJSXType;
  name: string;
  frame?: IObject<any>;
  frameOrder?: IObject<any>;
  moveMatrix?: number[];

  scopeId?: string;
  children?: ElementInfo[];
  attrs?: IObject<any>;
  componentId?: string;
  jsxId?: string;
  el?: HTMLElement | null;
  id?: string;
  index?: number;
  innerText?: string;
  innerHTML?: string;
}

export type EditorType = 'post' | 'profile';

export type ViewMode = 'PC' | 'tablet' | 'mobile';
