'use client';
import classNames from 'classnames';
import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { IClassicBody } from '@/entities/Post/model/types';
import { useAuth } from '@/features/Auth/useAuth/useAuth';
import ArrowSendIcon from '@/shared/assets/icons/ArrowSendIcon';
import GalleryDownloadIcon from '@/shared/assets/icons/GalleryDownload';
import { UploadedFile } from '@/shared/types';
import Button from '@/shared/ui/Button';
import FileInput from '@/shared/ui/FileInput/FileInput';

type PropTypes = {
  replyInput: IClassicBody;
  setReplyInput: Dispatch<SetStateAction<IClassicBody>>;
  handleSubmit: () => void;
  isFetchingResponse: boolean;
  isReplyValid: boolean;
  uploadedImages: UploadedFile[] | undefined;
  setUploadedImages: Dispatch<SetStateAction<UploadedFile[] | undefined>>;
};

//TODO: rewrite using shared/ui/Input component

const uniqueInputId = () => `text-input-${uuidv4()}`;

export const SendReply = ({
  replyInput,
  setReplyInput,
  handleSubmit,
  isFetchingResponse,
  isReplyValid,
  uploadedImages,
  setUploadedImages,
}: PropTypes) => {
  const [isScrollOn, setIsScrollOn] = useState(false);
  const [inputId] = useState(uniqueInputId());
  const { isLogged } = useAuth();

  const onClearImage = () => {
    setUploadedImages(undefined);
  };

  const adjustScrollHeight = (element: HTMLTextAreaElement, minHeight: number) => {
    element.style.height = '1px';
    const scrollHeight = element.scrollHeight;

    if (scrollHeight > minHeight) {
      element.style.height = element.scrollHeight + 'px';
    } else {
      element.style.height = `${minHeight}px`;
    }
  };

  useEffect(() => {
    const element = document.getElementById(inputId) as HTMLTextAreaElement;
    if (element) {
      const minHeight = uploadedImages?.length ? 156 : 60;
      adjustScrollHeight(element, minHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedImages]);

  return (
    <>
      {!isLogged ? (
        <Link
          className="bg-[#2DC96B] text-white flex justify-center items-center p-2 rounded-full"
          href={'/login'}
        >
          Войти в аккаунт
        </Link>
      ) : (
        <>
          <div className="flex gap-3 p-2">
            <div className="w-full relative">
              <textarea
                id={inputId}
                value={replyInput.text}
                onChange={(e) => {
                  setReplyInput((state) => ({
                    ...state,
                    text: e.target.value,
                    with_default_reaction: true,
                  }));
                  const scrollOn = e.target.scrollHeight > 256;
                  setIsScrollOn(scrollOn);

                  if (!scrollOn) {
                    const minHeight = uploadedImages?.length ? 156 : 60;
                    adjustScrollHeight(e.target, minHeight);
                  }
                }}
                maxLength={1000}
                className={classNames(
                  'w-full rounded bg-[#E3E3E3] text-black whitespace-pre-wrap resize-none h-[156px] text-md p-2',
                  isScrollOn ? 'overflow-y-scroll' : 'overflow-y-hidden',
                )}
                placeholder="Напишите что вы думаете об этом"
              />

              <div className="absolute bottom-3 right-3 cursor-pointer hover:bg-gray-300 hover:opacity-100 opacity-50 p-2 rounded-xl">
                <FileInput
                  uploadedFiles={uploadedImages}
                  setUploadedFiles={setUploadedImages}
                  acceptType="image"
                  icon={<GalleryDownloadIcon />}
                  size={uploadedImages?.length ? '128' : '32'}
                  onRemoveClick={onClearImage}
                />
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              className="text-[#011627] h-14 relative overflow-hidden !w-fit"
              buttonRadius={'rounded'}
              buttonColor={isReplyValid ? 'primary' : 'disabled'}
            >
              {!isFetchingResponse ? null : (
                <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-slate-300 to-slate-100 animate-[moveGradient_2s_infinite] opacity-50 blur-xl" />
              )}
              <ArrowSendIcon />
            </Button>
          </div>
        </>
      )}
    </>
  );
};
