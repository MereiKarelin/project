import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { getBgImageSrc } from '@/_pages/Customizator/components/Editor/BgImagePopup/utils';
import {
  getId,
  getWidget,
  isWidgetId,
  parseWidgetType,
  setBGImage,
} from '@/_pages/Customizator/utils';
import GalleryDownloadIcon from '@/shared/assets/icons/GalleryDownload';
import { UploadedFile } from '@/shared/types';
import { Button } from '@/shared/ui/ButtonNew';
import FileInput from '@/shared/ui/FileInput/FileInput';
import { getLastArrayElement } from '@/shared/utils';

import { widgets } from '../../../consts';

type PropTypes = {
  isClosed: boolean;
  handleClose: (close: boolean) => void;
  target: SVGElement | HTMLElement | null;
  uploadedFiles: {
    [targetId: string]: UploadedFile;
  };
  setUploadedFiles: Dispatch<
    SetStateAction<{
      [targetId: string]: UploadedFile;
    }>
  >;
};
export const BgImagePopup = ({
  isClosed,
  handleClose,
  target,
  uploadedFiles,
  setUploadedFiles,
}: PropTypes) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[] | undefined>();

  useEffect(() => {
    if (isClosed || !target) return;
    const targetId = getId(target);

    if (!targetId) return;

    const widget = getWidget(target as HTMLElement);
    const bgTarget = widget?.getBGElement?.(targetId) ?? (target as HTMLElement);

    const src = getBgImageSrc(bgTarget);
    if (src) {
      const imageFile = uploadedFiles[src];
      setUploadedImages([imageFile]);
    } else {
      setUploadedImages(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClosed, target]);

  if (isClosed || !target) return null;

  //if no element is selected do not open popup
  const targetId = getId(target);
  if (!targetId) return;

  return (
    <div
      className="h-screen w-screen fixed top-0 flex flex-col items-center left-0 justify-center bg-black/50 z-40 overflow-scroll"
      onClick={(e) => {
        e.stopPropagation();
        handleClose(true);
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <div className="bg-black w-full flex justify-center items-center rounded-t-xl h-10">
          <span className="text-white">Выберите картинку</span>
        </div>
        <div className="bg-white px-20 pt-10 pb-8">
          <FileInput
            uploadedFiles={uploadedImages}
            setUploadedFiles={setUploadedImages}
            acceptType="image"
            icon={<GalleryDownloadIcon />}
            onRemoveClick={() => setUploadedImages(undefined)}
          />
        </div>
        <div className="flex items-start justify-center text-black h-12 rounded-b-xl bg-white gap-3">
          <Button
            size={'s'}
            onClick={() => {
              const imgFile = getLastArrayElement(uploadedImages);
              const src = imgFile?.src;

              if (isWidgetId(targetId)) {
                const widgetType = parseWidgetType(targetId);
                const widget = widgets[widgetType];
                if (!widget?.setBGImage) {
                  setBGImage(imgFile, targetId);
                } else {
                  widget?.setBGImage?.(imgFile, targetId);
                }
              }

              if (src) {
                setUploadedFiles((prev) => ({ ...prev, [src]: imgFile }));
              }

              handleClose(true);
            }}
          >
            Сохранить
          </Button>
          <Button
            size={'s'}
            onClick={() => {
              const widget = getWidget(target as HTMLElement);
              const bgTarget = widget?.getBGElement?.(targetId) ?? (target as HTMLElement);

              const src = getBgImageSrc(bgTarget);
              if (src) {
                const initialImage = uploadedFiles?.[src];
                if (initialImage) setUploadedImages([initialImage]);
              }
              handleClose(true);
            }}
          >
            Отмена
          </Button>
        </div>
      </div>
    </div>
  );
};
