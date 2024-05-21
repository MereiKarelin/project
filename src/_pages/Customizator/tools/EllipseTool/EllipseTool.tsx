import { EllipseIcon } from '@/_pages/Customizator/Icons/EllipseIcon';
import { selectEndHandler } from '@/_pages/Customizator/tools/handlers';
import { Tool, ToolProperties } from '@/_pages/Customizator/types';

export const EllipseTool: Tool = {
  id: 'Ellipse',
  type: 'tool',
  icon: (selected?: boolean) => <EllipseIcon stroke={selected ? '#fff' : '#555'} />,
  title: 'ellipse',
  elementProperties: (toolProperties: ToolProperties) => ({
    attrs: {},
    style: {
      'background-color': toolProperties.get('background-color'),
      'border-radius': '50%',
    },
  }),
  selectEndHandler: selectEndHandler,
  bodyType: 'Ellipse', //used for collision calculation
};
