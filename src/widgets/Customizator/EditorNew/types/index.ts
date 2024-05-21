import { Dispatch, JSXElementConstructor, ReactElement, SetStateAction } from 'react';

export type IObject<T> = {
  [name: string]: T;
};

export type ScenaProps = {
  scenaElementId?: string;
  scenaAttrs?: IObject<any>;
  scenaText?: string;
  scneaHTML?: string;
};

export type ScenaFunctionJSXElement = ReactElement<any, ScenaComponent>;
export type ScenaComponent = JSXElementConstructor<ScenaProps> & { scenaComponentId: string };
export type ScenaJSXElement = ReactElement<any, string> | ScenaFunctionJSXElement;
export type ScenaJSXType = ScenaJSXElement | string | ScenaComponent;
export type ElementInfo = {
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
};

type SubmenuProps = {
  onClick: (e: any, toolId: ToolId) => void;
  viewMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
};

export type Tool = {
  id: ToolId;
  name: string;
  className?: string;
  title?: string;
  icon?: (selected?: boolean) => JSX.Element;
  selected?: boolean;
  keys?: string[];
  submenuJSX?: ({ onClick, viewMode, setViewMode }: SubmenuProps) => JSX.Element;
  submenuWidth?: number;
};

export type ToolGroup = {
  id: ToolId;
  group: { [key in ToolId]?: Tool };
};

export type ToolId =
  | 'alignment'
  | 'cropInset'
  | 'crop'
  | 'cursor'
  | 'ellipse'
  | 'expandMenu'
  | 'feed'
  | 'filters'
  | 'galleryUpload'
  | 'layers'
  | 'move'
  | 'rectangle'
  | 'roundRectangle'
  | 'text'
  | 'circle'
  | 'group';

export type ViewMode = 'PC' | 'tablet' | 'mobile';
