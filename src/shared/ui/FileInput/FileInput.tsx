'use client';
import classNames from 'classnames';
import Image from 'next/image';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

import CloseIcon from '@/shared/assets/icons/CloseIcon';
import { allowedXtensions, maxImageFileSize } from '@/shared/consts';
import { UploadedFile, UploadedFileTypes } from '@/shared/types';
import OverlayTooltip from '@/shared/ui/OverlayTooltip/OverlayTooltip';
import { getLastArrayElement } from '@/shared/utils';

type PropTypes = {
  uploadedFiles: UploadedFile[] | undefined;
  setUploadedFiles: Dispatch<SetStateAction<UploadedFile[] | undefined>>;
  maxCount?: number;
  maxFileSize?: number;
  icon: React.ReactNode;
  acceptType: UploadedFileTypes;
  tooltipHidden?: boolean;
  size?: '24' | '32' | '48' | '64' | '128' | '192';
  onRemoveClick?: () => void;
};

//TODO: make FileInput accept 'video' | 'document' | 'audio' types;
//TODO: add option for uploading multiple files

const FileInput = ({
  uploadedFiles,
  setUploadedFiles,
  acceptType,
  icon,
  maxFileSize = maxImageFileSize,
  tooltipHidden = false,
  size = '192',
  onRemoveClick,
}: PropTypes) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | undefined>();
  const closeIconSize = parseInt(size) < 64 ? 12 : 24;
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > maxFileSize) {
      const maxSizeMb = maxFileSize / (1024 * 1024);
      alert(`File size can not exceed ${maxSizeMb} MB`);
      return;
    }

    const filteredFiles = uploadedFiles?.filter((file) => file.src !== uploadedFile?.src) || [];

    const objectUrl = URL.createObjectURL(file);
    const newFile = { src: objectUrl, type: acceptType, file: file };
    setUploadedFiles(() => [...filteredFiles, newFile]);
    setUploadedFile(newFile);
  };

  const chosenFile = getLastArrayElement(uploadedFiles);
  const filename = chosenFile?.file?.name || chosenFile?.src.split('/').pop() || '';

  return (
    <div
      className="relative flex flex-row items-center justify-center rounded-md bg-gray-300"
      style={{ height: `${size}px`, width: `${size}px` }}
    >
      <div
        className={classNames(
          'absolute z-20 hover:opacity-100',
          tooltipHidden ? (filename ? 'opacity-0' : 'opacity-50') : 'opacity-50',
        )}
      >
        <div className="relative flex flex-row gap-3">
          <div
            className={classNames(
              'flex items-center justify-center rounded-md bg-gray-500 h-8 w-8',
            )}
          >
            {icon}
          </div>

          <input
            type="file"
            accept={allowedXtensions[acceptType]}
            id="file"
            onChange={handleInputChange}
            className="absolute left-0 top-0 w-full opacity-0 cursor-pointer text-[0px] h-8"
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      </div>
      {!chosenFile ? null : tooltipHidden ? (
        <>
          {onRemoveClick && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onRemoveClick();
              }}
              className={classNames(
                'absolute z-20 cursor-pointer rounded-full bg-red-300 p-1 hover:bg-red-500',
                closeIconSize === 12 ? '-right-1 -top-1' : '-right-3 -top-3',
              )}
            >
              <CloseIcon fill="#000" width={closeIconSize} />
            </div>
          )}
          <Image src={chosenFile.src} alt={filename} className="object-contain" fill />
        </>
      ) : (
        <>
          {onRemoveClick && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onRemoveClick();
              }}
              className={classNames(
                'absolute z-20 cursor-pointer rounded-full bg-red-300 p-1 hover:bg-red-500',
                closeIconSize === 12 ? '-right-1 -top-1' : '-right-3 -top-3',
              )}
            >
              <CloseIcon fill="#000" width={closeIconSize} />
            </div>
          )}
          <OverlayTooltip text={filename} zIndex="10">
            <Image src={chosenFile.src} alt={filename} className="object-contain" fill />
          </OverlayTooltip>
        </>
      )}
    </div>
  );
};

export default FileInput;
