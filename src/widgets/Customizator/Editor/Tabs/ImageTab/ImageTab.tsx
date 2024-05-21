import MoveableHelper from 'moveable-helper';
import { RefObject } from 'react';
import Selecto from 'react-selecto';

import { PhotoCameraIcon } from '@/shared/assets/icons/PhotoCameraIcon';
import { Viewport } from '@/widgets/Customizator/Editor/components';
import {
  EventBus,
  HistoryManager,
  TargetsManager,
  Tool,
} from '@/widgets/Customizator/Editor/types';
import { appendBlob, prefix } from '@/widgets/Customizator/Editor/utils';

type PropTypes = {
  viewportRef: RefObject<Viewport>;
  moveableHelper: MoveableHelper;
  targetsManager: TargetsManager;
  historyManager: HistoryManager;
  selecto: RefObject<Selecto>;
  eventBus: EventBus;
};
export const ImageTab: Tool = {
  id: 'Image',
  type: 'tab',
  title: 'Img',
  icon: () => <PhotoCameraIcon />,
  Component: ({
    viewportRef,
    moveableHelper,
    targetsManager,
    historyManager,
    selecto,
    eventBus,
  }: PropTypes) => {
    const uploadImage = async (e: any) => {
      const file = e.target.files[0];

      await appendBlob(
        file,
        viewportRef,
        moveableHelper,
        targetsManager,
        historyManager,
        selecto,
        eventBus,
      );
    };

    return (
      <div className={prefix('img-tab')}>
        <div className="flex flex-col gap-2">
          <input placeholder="choose img" type="file" onChange={uploadImage} />
        </div>
      </div>
    );
  },
};
