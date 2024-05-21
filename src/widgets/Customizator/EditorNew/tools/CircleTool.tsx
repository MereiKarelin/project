import type { Tool } from '@/widgets/Customizator/EditorNew/types';
import { CircleToolIcon } from '@/widgets/Customizator/EditorNew/uis/icons';

export const CircleTool: Tool = {
  id: 'circle',
  name: 'circle',
  icon: (selected) => (selected ? <CircleToolIcon stroke="#fff" /> : <CircleToolIcon />),
  className: 'text-white p-1 rounded-3xl',
};
