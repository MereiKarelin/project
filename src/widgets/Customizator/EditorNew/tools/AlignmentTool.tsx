import type { Tool } from '@/widgets/Customizator/EditorNew/types';
import { AlignmentToolIcon } from '@/widgets/Customizator/EditorNew/uis/icons';

export const AlignmentTool: Tool = {
  id: 'alignment',
  name: 'alignment',
  icon: (selected) => (selected ? <AlignmentToolIcon stroke="#fff" /> : <AlignmentToolIcon />),
  className: 'text-white p-1 rounded-3xl',
};
