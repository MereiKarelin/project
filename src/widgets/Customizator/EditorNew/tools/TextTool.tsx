import type { Tool } from '@/widgets/Customizator/EditorNew/types';
import { TextToolIcon } from '@/widgets/Customizator/EditorNew/uis/icons';

export const TextTool: Tool = {
  id: 'text',
  name: 'text',
  icon: (selected) => (selected ? <TextToolIcon stroke="#fff" /> : <TextToolIcon />),
  className: 'text-white p-1 rounded-3xl',
};
