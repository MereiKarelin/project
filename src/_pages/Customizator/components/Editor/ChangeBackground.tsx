import { ChangeEvent, Dispatch, SetStateAction } from 'react';

import { EditorType } from '@/_pages/Customizator/types';
import { ChangeBGToolIcon } from '@/shared/assets/icons';
import { allowedXtensions, maxImageFileSize } from '@/shared/consts';
import { UploadedFile } from '@/shared/types';
import { Button } from '@/shared/ui/ButtonNew';
import { changeBackground, replaceObjectEntry } from '@/shared/utils';

type PropTypes = {
  bgImage: string;
  setBgImage: Dispatch<SetStateAction<string>>;
  uploadedFiles: {
    [id: string]: UploadedFile;
  };
  setUploadedFiles: Dispatch<
    SetStateAction<{
      [id: string]: UploadedFile;
    }>
  >;
  editorType: EditorType;
};

export const ChangeBackground = ({
  bgImage,
  setBgImage,
  uploadedFiles,
  setUploadedFiles,
  editorType,
}: PropTypes) => {
  if (editorType === 'post') return null;

  const handleBGImageChange = (e: ChangeEvent<HTMLInputElement>) => {
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

    setBgImage(objectUrl);
    changeBackground(objectUrl);

    const newFile: UploadedFile = { src: objectUrl, type: 'image', file: file };
    const updatedUploadedFiles = replaceObjectEntry(uploadedFiles, bgImage, objectUrl, newFile);
    setUploadedFiles({ ...updatedUploadedFiles });
  };

  return (
    <Button color="secondary" textColor="secondary" size="s">
      <ChangeBGToolIcon height={24} stroke="#fff" />
      <span className="hidden sm:flex h-6 flex-col justify-center">Изменить фон</span>
      <input
        type="file"
        accept={allowedXtensions['image']}
        id="file"
        onChange={handleBGImageChange}
        className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer text-[0px]"
        onClick={(e) => e.stopPropagation()}
      />
    </Button>
  );
};
