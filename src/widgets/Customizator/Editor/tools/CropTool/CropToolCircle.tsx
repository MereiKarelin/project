import { CropIcon } from '@/widgets/Customizator/Editor/Icons';
import { SubMenuCrop } from '@/widgets/Customizator/Editor/tools';
import { selectEndHandler } from '@/widgets/Customizator/Editor/tools/handlers';
import { ClipPath, Tool } from '@/widgets/Customizator/Editor/types';

const clipPath: ClipPath = 'circle';

export const CropToolCircle: Tool = {
  id: 'CropCircle',
  type: 'tool',
  icon: () => <CropIcon />,
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
