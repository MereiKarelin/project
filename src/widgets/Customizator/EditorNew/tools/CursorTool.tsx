import type { Tool } from '@/widgets/Customizator/EditorNew/types';
import { CursorIcon } from '@/widgets/Customizator/EditorNew/uis/icons';

export const CursorTool: Tool = {
  id: 'cursor',
  name: 'cursor',
  icon: (selected) => (selected ? <CursorIcon stroke="#fff" /> : <CursorIcon />),
  className: 'text-white p-1 rounded-3xl',
  keys: ['v'],
};
