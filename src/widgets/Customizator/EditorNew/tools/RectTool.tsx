import type { Tool } from '@/widgets/Customizator/EditorNew/types';
import { RectToolIcon } from '@/widgets/Customizator/EditorNew/uis/icons';

export const RectTool: Tool = {
  id: 'rectangle',
  name: 'rectangle',
  icon: (selected) => (selected ? <RectToolIcon fill="#fff" /> : <RectToolIcon />),
  className: 'text-white p-1 rounded-3xl',
};
