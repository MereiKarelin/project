import type { Tool } from '@/widgets/Customizator/EditorNew/types';
import { RoundRectToolIcon } from '@/widgets/Customizator/EditorNew/uis/icons';

export const RoundRectTool: Tool = {
  id: 'roundRectangle',
  name: 'round rectangle',
  icon: (selected) => (selected ? <RoundRectToolIcon fill="#fff" /> : <RoundRectToolIcon />),
  className: 'text-white p-1 rounded-3xl',
};
