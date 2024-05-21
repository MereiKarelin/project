import { CropEllipseIcon } from '@/_pages/Customizator/Icons';
import { SubMenuCrop } from '@/_pages/Customizator/tools';
import { selectEndHandler } from '@/_pages/Customizator/tools/handlers';
import { ClipPath, Tool } from '@/_pages/Customizator/types';

const clipPath: ClipPath = 'ellipse';

export const CropToolEllipse: Tool = {
  id: 'CropEllipse',
  type: 'tool',
  icon: (selected?: boolean) => <CropEllipseIcon stroke={selected ? '#fff' : '#555'} />,
  title: 'ellipse',
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
