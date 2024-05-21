import type { Tool } from '@/widgets/Customizator/EditorNew/types';
import { GalleryUploadIcon } from '@/widgets/Customizator/EditorNew/uis/icons';

export const GalleryUploadTool: Tool = {
  id: 'galleryUpload',
  name: 'gallery upload',
  icon: (selected) => (selected ? <GalleryUploadIcon stroke="#fff" /> : <GalleryUploadIcon />),
  className: 'text-white p-1 rounded-3xl',
};
