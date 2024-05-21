import { CropRectIcon } from '@/_pages/Customizator/Icons';
import { SubMenuCrop } from '@/_pages/Customizator/tools';
import { selectEndHandler } from '@/_pages/Customizator/tools/handlers';
import { ClipPath, Tool } from '@/_pages/Customizator/types';

const clipPath: ClipPath = 'inset';

export const CropToolRect: Tool = {
  id: 'CropRect',
  type: 'tool',
  icon: (selected?: boolean) => <CropRectIcon stroke={selected ? '#fff' : '#555'} />,
  title: 'rect',
  Component: ({
    selectedTool,
    setSelectedTool,
  }: {
    selectedTool: Tool;
    setSelectedTool: (tool: Tool) => void;
  }) => <SubMenuCrop selectedTool={selectedTool} setSelectedTool={setSelectedTool} />,
  selectEndHandler: selectEndHandler,
  toolProperties: [{ crop: clipPath }],
};
