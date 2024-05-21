import MoveableHelper from 'moveable-helper';
import { Dispatch, RefObject, SetStateAction } from 'react';
import Selecto from 'react-selecto';

import { Viewport } from '@/_pages/Customizator/components';
import { GalleryUploadIcon } from '@/_pages/Customizator/Icons';
import { appendBlob, prefix } from '@/_pages/Customizator/utils';
import { maxImageFileSize } from '@/shared/consts';
import { UploadedFile } from '@/shared/types';

import type { EventBus, HistoryManager, Tab, TargetsManager } from '@/_pages/Customizator/types';
type PropTypes = {
  setIsSubMenuShown: Dispatch<SetStateAction<boolean>>;
  viewportRef: RefObject<Viewport>;
  moveableHelper: MoveableHelper;
  targetsManager: TargetsManager;
  historyManager: HistoryManager;
  selecto: RefObject<Selecto>;
  eventBus: EventBus;
  setUploadedFiles: Dispatch<SetStateAction<{ [id: string]: UploadedFile }>>;
};

export const GalleryUploadTool: Tab = {
  id: 'Image',
  type: 'tab',
  title: 'gallery upload',
  icon: (selected) => <GalleryUploadIcon stroke={selected ? '#fff' : '#555'} />,
  subMenuWidth: 380,
  Component: ({
    setIsSubMenuShown,
    viewportRef,
    moveableHelper,
    targetsManager,
    historyManager,
    selecto,
    eventBus,
    setUploadedFiles,
  }: PropTypes) => {
    const addImage = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) {
        return;
      }

      if (file.size > maxImageFileSize) {
        const maxSizeMb = maxImageFileSize / (1024 * 1024);
        alert(`File size can not exceed ${maxSizeMb} MB`);
        return;
      }

      const objectUrl = URL.createObjectURL(file);

      const newFile: UploadedFile = { src: objectUrl, type: 'image', file: file };
      setUploadedFiles((state) => ({ ...state, [objectUrl]: newFile }));

      await appendBlob(
        objectUrl,
        viewportRef,
        moveableHelper,
        targetsManager,
        historyManager,
        selecto,
        eventBus,
      );
      setIsSubMenuShown(false);
    };

    return (
      <div className={prefix('img-tab')}>
        <div className="flex flex-col gap-2">
          <input placeholder="choose img" type="file" onChange={addImage} />
        </div>
      </div>
    );
  },
};
