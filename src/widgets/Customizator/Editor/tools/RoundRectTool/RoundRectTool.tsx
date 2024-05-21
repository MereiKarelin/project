import { RoundRectIcon } from '@/widgets/Customizator/Editor/Icons';
import { selectEndHandler } from '@/widgets/Customizator/Editor/tools/handlers';
import { Tool, ToolProperties } from '@/widgets/Customizator/Editor/types';

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
};
