import type { Tool } from '@/widgets/Customizator/EditorNew/types';
import { MoveToolIcon } from '@/widgets/Customizator/EditorNew/uis/icons';

export const MoveTool: Tool = {
  id: 'move',
  name: 'move',
  icon: (selected) => (selected ? <MoveToolIcon stroke="#fff" /> : <MoveToolIcon />),
  className: 'text-white p-1 rounded-3xl',
};
