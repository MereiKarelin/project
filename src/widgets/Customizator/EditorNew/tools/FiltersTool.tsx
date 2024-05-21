import type { Tool } from '@/widgets/Customizator/EditorNew/types';
import { FiltersToolIcon } from '@/widgets/Customizator/EditorNew/uis/icons';

export const FiltersTool: Tool = {
  id: 'filters',
  name: 'filters',
  icon: (selected) =>
    selected ? <FiltersToolIcon stroke="#fff" fill="#fff" /> : <FiltersToolIcon />,
  className: 'text-white p-1 rounded-3xl',
};
