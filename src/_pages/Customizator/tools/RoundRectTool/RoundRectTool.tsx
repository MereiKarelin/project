import { RoundRectIcon } from '@/_pages/Customizator/Icons';
import { selectEndHandler } from '@/_pages/Customizator/tools/handlers';
import { Tool, ToolProperties } from '@/_pages/Customizator/types';

export const RoundRectTool: Tool = {
  id: 'RoundRect',
  type: 'tool',
  icon: (selected?: boolean) => <RoundRectIcon fill={selected ? '#fff' : '#555'} />,
  title: 'round rectangle',
  elementProperties: (toolProperties: ToolProperties) => ({
    attrs: {},
    style: {
      'background-color': toolProperties.get('background-color'),
      'border-radius': '10px',
    },
  }),
  selectEndHandler: selectEndHandler,
  bodyType: 'RoundRect',
};
