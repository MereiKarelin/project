import type { Tool } from '@/widgets/Customizator/EditorNew/types';
import { CropToolIcon } from '@/widgets/Customizator/EditorNew/uis/icons';

export const CropTool: Tool = {
  id: 'crop',
  name: 'crop',
  icon: (selected) => (selected ? <CropToolIcon stroke="#fff" /> : <CropToolIcon />),
  className: 'text-white p-1 rounded-3xl',
  keys: ['r'],
};
