import { CropPolygonIcon } from '@/_pages/Customizator/Icons';
import { SubMenuCrop } from '@/_pages/Customizator/tools';
import { selectEndHandler } from '@/_pages/Customizator/tools/handlers';
import { ClipPath, Tool } from '@/_pages/Customizator/types';

const clipPath: ClipPath = 'polygon';

export const CropToolPolygon: Tool = {
  id: 'CropPolygon',
  type: 'tool',
  icon: (selected?: boolean) => <CropPolygonIcon stroke={selected ? '#fff' : '#555'} />,
  title: 'polygon',
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
