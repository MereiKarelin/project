import {
  AlignmentTool,
  CircleTool,
  CropTool,
  CursorTool,
  FeedTool,
  FiltersTool,
  GalleryUploadTool,
  LayersTool,
  TextTool,
} from '@/widgets/Customizator/EditorNew/tools';

import type { Tool, ToolGroup, ToolId, ViewMode } from '@/widgets/Customizator/EditorNew/types';

export const toolsDesktop: Tool[] = [
  CursorTool,
  TextTool,
  GalleryUploadTool,
  CircleTool,
  LayersTool,
  FiltersTool,
  AlignmentTool,
  CropTool,
] as const;

const toolGroup: ToolGroup = {
  id: 'group',
  group: {
    text: TextTool,
    galleryUpload: GalleryUploadTool,
    circle: CircleTool,
    filters: FiltersTool,
  },
};

export const toolGroupIds: ToolId[] = ['group'];

export const toolsMobile: (Tool | ToolGroup)[] = [
  FeedTool,
  CursorTool,
  toolGroup,
  LayersTool,
  AlignmentTool,
  CropTool,
] as const;

export const viewModes: { id: ViewMode; name: string }[] = [
  // { id: 'PC', name: 'Компьютерный' },
  // { id: 'tablet', name: 'Планшетный' },
  { id: 'mobile', name: 'Мобильный' },
] as const;
