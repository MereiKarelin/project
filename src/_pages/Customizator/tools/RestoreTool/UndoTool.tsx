import { UndoIcon } from '@/_pages/Customizator/Icons';
import { HistoryManager, Tool } from '@/_pages/Customizator/types';

export const UndoTool: Tool = {
  id: 'Undo',
  type: 'tool',
  icon: (selected?: boolean) => <UndoIcon stroke={selected ? '#fff' : '#e0e0e0'} />,
  title: 'undo',
  onClick: (historyManager: HistoryManager) => historyManager.undo(),
};
