import type { Tool } from '@/widgets/Customizator/EditorNew/types';
import { CropInsetToolIcon } from '@/widgets/Customizator/EditorNew/uis/icons';

export const CropInsetTool: Tool = {
  id: 'cropInset',
  name: 'crop inset',
  icon: (selected) => (selected ? <CropInsetToolIcon stroke="#fff" /> : <CropInsetToolIcon />),
  className: 'text-white p-1 rounded-3xl',
};
