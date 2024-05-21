import { MoveIcon } from '@/_pages/Customizator/Icons';
import { selectEndHandlerMove } from '@/_pages/Customizator/tools/handlers';
import { Tool } from '@/_pages/Customizator/types';

export const MoveTool: Tool = {
  id: 'Move',
  type: 'tool',
  icon: (selected?: boolean) => <MoveIcon stroke={selected ? '#fff' : '#555'} />,
  title: 'move',
  selectEndHandler: selectEndHandlerMove,
};
