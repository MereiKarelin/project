import { EllipseIcon } from '@/widgets/Customizator/Editor/Icons/EllipseIcon';
import { selectEndHandler } from '@/widgets/Customizator/Editor/tools/handlers';
import { Tool, ToolProperties } from '@/widgets/Customizator/Editor/types';

export const EllipseTool: Tool = {
  id: 'Ellipse',
  type: 'tool',
  icon: (selected?: boolean) => <EllipseIcon fill={selected ? '#fff' : '#555'} />,
  title: 'ellipse',
  elementProperties: (toolProperties: ToolProperties) => ({
    attrs: {},
    style: {
      'background-color': toolProperties.get('background-color'),
      'border-radius': '50%',
    },
  }),
  selectEndHandler: selectEndHandler,
};
