import { RedoIcon } from '@/_pages/Customizator/Icons';
import { HistoryManager, Tool } from '@/_pages/Customizator/types';

export const RedoTool: Tool = {
  id: 'Redo',
  type: 'tool',
  icon: (selected?: boolean) => <RedoIcon stroke={selected ? '#fff' : '#e0e0e0'} />,
  title: 'redo',
  onClick: (historyManager: HistoryManager) => historyManager.redo(),
};
