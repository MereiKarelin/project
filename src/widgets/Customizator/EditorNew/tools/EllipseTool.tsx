import type { Tool } from '@/widgets/Customizator/EditorNew/types';
import { EllipseToolIcon } from '@/widgets/Customizator/EditorNew/uis/icons';

export const EllipseTool: Tool = {
  id: 'ellipse',
  name: 'ellipse',
  icon: (selected) => (selected ? <EllipseToolIcon fill="#fff" /> : <EllipseToolIcon />),
  className: 'text-white p-1 rounded-3xl',
};
