import { TextIcon } from '@/widgets/Customizator/Editor/Icons';
import { selectEndHandler } from '@/widgets/Customizator/Editor/tools/handlers';
import { Tool, ToolProperties } from '@/widgets/Customizator/Editor/types';

export const TextTool: Tool = {
  id: 'Text',
  type: 'tool',
  icon: () => <TextIcon />,
  title: 'text',
  elementProperties: (toolProperties: ToolProperties) => ({
    attrs: {
      contenteditable: true,
    },
    style: {
      color: toolProperties.get('color'),
    },
  }),
  selectEndHandler: selectEndHandler,
};
