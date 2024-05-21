import {
  AlignmentTool,
  CropToolCircle,
  CropToolEllipse,
  CropToolPolygon,
  CropToolRect,
  EllipseTool,
  FiltersTool,
  GalleryUploadTool,
  MoveTool,
  RoundRectTool,
  TextTool,
  ViewModeTool,
} from '@/_pages/Customizator/tools';
import { LayersTool } from '@/_pages/Customizator/tools/LayersTool/LayersTool';
import { ViewMode } from '@/_pages/Customizator/types';
import {
  AvatarWidget,
  FollowersWidget,
  FriendsWidget,
  FullnameWidget,
  LinkWidget,
  SubscriptionsWidget,
} from '@/_pages/Customizator/widgets';

import type { Tab, Tool, ToolGroup, ToolId } from '@/_pages/Customizator/types';

import type { ToolbarItem } from '@/_pages/Customizator/types';
export const PREFIX = 'scena-';
export const DATA_SCENA_ELEMENT_ID = 'data-scena-element-id';
export const DATA_SCENA_ELEMENT = 'data-scena-element';
export const TYPE_SCENA_LAYERS = 'application/x-scena-layers';

export const viewModes: { id: ViewMode; name: string }[] = [
  // { id: 'PC', name: 'Компьютерный' }, //TODO: add more view options
  // { id: 'tablet', name: 'Планшетный' },
  { id: 'mobile', name: 'Мобильный' },
] as const;

export const CropToolGroup: ToolGroup = {
  id: 'CropToolGroup',
  type: 'toolGroup',
  subMenuWidth: 152,
  tools: [CropToolRect, CropToolCircle, CropToolEllipse, CropToolPolygon],
};

export const ShapesToolGroup: ToolGroup = {
  id: 'ShapesGroup',
  type: 'toolGroup',
  subMenuWidth: 200,
  tools: [EllipseTool, RoundRectTool],
};

export const ToolsDesktop: ToolbarItem[] = [
  MoveTool,
  TextTool,
  GalleryUploadTool,
  ShapesToolGroup,
  LayersTool,
  FiltersTool,
  AlignmentTool,
  CropToolGroup,
] as const;

export const ToolsTablet: ToolbarItem[] = [
  ViewModeTool,
  MoveTool,
  TextTool,
  GalleryUploadTool,
  ShapesToolGroup,
  LayersTool,
  FiltersTool,
  AlignmentTool,
  CropToolGroup,
] as const;

export const MobileToolGroup: ToolGroup = {
  id: 'MobileToolGroup',
  type: 'toolGroup',
  subMenuWidth: 192,
  tools: [TextTool, GalleryUploadTool, EllipseTool, RoundRectTool, FiltersTool],
};

export const ToolsMobile: ToolbarItem[] = [
  ViewModeTool,
  MoveTool,
  MobileToolGroup,
  LayersTool,
  AlignmentTool,
  CropToolGroup,
] as const;

const getToolsList = (toolbarItems: ToolbarItem[]) => {
  const tabs = toolbarItems.filter((item) => item.type === 'tab') as Tab[];
  const tools = toolbarItems.filter((item) => item.type === 'tool') as Tool[];
  const toolGroups = toolbarItems.filter((item) => item.type === 'toolGroup') as ToolGroup[];
  const toolGroupItems = toolGroups.map((group) => group.tools).flat();

  const toolsList = [...tabs, ...tools, ...toolGroupItems];

  return toolsList;
};

//list of tools: {ToolId: Tool |Tab}
export const tools: Partial<{ [id in ToolId]: Tool }> = Object.fromEntries(
  getToolsList(ToolsDesktop).map((item) => [item.id, item]),
);

export const widgetsProfile = [FullnameWidget, AvatarWidget];
export const widgetsAllArray = [
  ...widgetsProfile,
  LinkWidget,
  FollowersWidget,
  SubscriptionsWidget,
  FriendsWidget,
];

export const widgets = Object.fromEntries(widgetsAllArray.map((widget) => [widget.id, widget]));
