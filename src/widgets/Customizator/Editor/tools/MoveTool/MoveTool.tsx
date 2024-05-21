import { MoveIcon } from '@/widgets/Customizator/Editor/Icons';
import { selectEndHandlerMove } from '@/widgets/Customizator/Editor/tools/handlers';
import { Tool } from '@/widgets/Customizator/Editor/types';

export const MoveTool: Tool = {
  id: 'Move',
  type: 'tool',
  icon: (selected?: boolean) => <MoveIcon fill={selected ? '#fff' : '#555'} />,
  title: 'move',
  selectEndHandler: selectEndHandlerMove,
};
