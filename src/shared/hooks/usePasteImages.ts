import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { UploadedFile, UploadedFileTypes } from '@/shared/types';

import { maxImageFileSize } from '../consts';

export const usePasteImages = (
  targetId: string,
  handleImagePaste: (file: UploadedFile) => void,
) => {
  useEffect(() => {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
      console.error(`no element found with id ${targetId}`);
      return;
    }

    const pasteCallback = async () => {
      try {
        const clipboardItems = await navigator.clipboard.read();
        const item = clipboardItems[0];

        const imageTypes = item.types.filter((item) => {
          const type = item.split('/')[0];

          return type === 'image';
        });

        if (imageTypes.length > 0) {
          const type = imageTypes[0];
          const ext = type.split('/')[1];

          const clipboardItems = await navigator.clipboard.read();
          const blobOutput = await clipboardItems[0].getType(type);

          const filename = `image-${uuidv4()}.${ext}`;
          const file = new File([blobOutput], filename, { type });
          const objectUrl = URL.createObjectURL(file);

          if (blobOutput.size > maxImageFileSize) {
            const maxSizeMb = maxImageFileSize / (1024 * 1024);
            alert(`File size can not exceed ${maxSizeMb} MB`);
            return;
          }

          const imageFile = { src: objectUrl, type: 'image' as UploadedFileTypes, file };
          handleImagePaste(imageFile);
        }
      } catch (e) {
        console.error(`image pasting failed: ${e}`);
      }
    };

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLocaleLowerCase() === 'v') {
        void pasteCallback();
      }
    };

    targetElement.addEventListener('keydown', keyDownHandler);
    targetElement.addEventListener('paste', pasteCallback);

    return () => {
      targetElement.removeEventListener('paste', pasteCallback);
      targetElement.removeEventListener('keydown', keyDownHandler);
    };
  }, []);
};
