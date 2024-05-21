import type { Tool } from '@/widgets/Customizator/EditorNew/types';
import { LayersToolIcon } from '@/widgets/Customizator/EditorNew/uis/icons';

export const LayersTool: Tool = {
  id: 'layers',
  name: 'layers',
  icon: (selected) => (selected ? <LayersToolIcon stroke="#fff" /> : <LayersToolIcon />),
  className: 'text-white p-1 rounded-3xl',
};
