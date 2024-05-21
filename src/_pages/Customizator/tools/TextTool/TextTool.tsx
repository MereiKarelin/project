import { TextIcon } from '@/_pages/Customizator/Icons';
import { selectEndHandler } from '@/_pages/Customizator/tools/handlers';
import { Tool, ToolProperties } from '@/_pages/Customizator/types';

export const TextTool: Tool = {
  id: 'Text',
  type: 'tool',
  icon: (selected?: boolean) => <TextIcon stroke={selected ? '#fff' : '#555'} />,
  title: 'text',
  elementProperties: (toolProperties: ToolProperties) => ({
    attrs: {
      contenteditable: true,
    },
    style: {
      color: toolProperties.get('color'),
      'font-size': '14px',
      'word-break': 'break-word',
      display: 'block',
    },
  }),
  selectEndHandler: selectEndHandler,
};
