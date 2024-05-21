import { CropCircleIcon } from '@/_pages/Customizator/Icons';
import { SubMenuCrop } from '@/_pages/Customizator/tools';
import { selectEndHandler } from '@/_pages/Customizator/tools/handlers';
import { ClipPath, Tool } from '@/_pages/Customizator/types';

const clipPath: ClipPath = 'circle';

export const CropToolCircle: Tool = {
  id: 'CropCircle',
  type: 'tool',
  icon: (selected?: boolean) => <CropCircleIcon stroke={selected ? '#fff' : '#555'} />,
  title: 'circle',
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
