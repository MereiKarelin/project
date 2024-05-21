import { UndoIcon } from '@/widgets/Customizator/Editor/Icons';
import { HistoryManager, Tool } from '@/widgets/Customizator/Editor/types';

export const UndoTool: Tool = {
  id: 'Undo',
  type: 'tool',
  icon: (selected?: boolean) => <UndoIcon stroke={selected ? '#fff' : '#e0e0e0'} />,
  title: 'undo',
  onClick: (historyManager: HistoryManager) => historyManager.undo(),
};
