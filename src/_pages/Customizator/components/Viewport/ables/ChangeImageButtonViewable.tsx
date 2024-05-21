import { MoveableManagerInterface, Renderer } from 'react-moveable';
import { v4 as uuidv4 } from 'uuid';

import GalleryDownloadIcon from '@/shared/assets/icons/GalleryDownload';

export interface ViewableProps {
  onClickChangeImageButton: () => void;
}
export const ChangeImageButtonViewable = {
  name: 'changeImageButtonViewable',
  props: ['onClickChangeImageButton'],
  events: [],
  render(moveable: MoveableManagerInterface<ViewableProps>, React: Renderer) {
    const rect = moveable.getRect();
    const { pos2 } = moveable.state;
    const {
      props: { onClickChangeImageButton },
    } = moveable;

    return (
      <div
        id="changeImageButtonViewable"
        key={`change-image-btn-${uuidv4()}`}
        className="bg-[#4af] w-6 h-6 rounded-[4px] flex items-center justify-center mb-1"
        onClick={() => onClickChangeImageButton()}
        style={{
          transform: `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg) translate(10px,28px)`,
        }}
      >
        <GalleryDownloadIcon />
      </div>
    );
  },
} as const;
