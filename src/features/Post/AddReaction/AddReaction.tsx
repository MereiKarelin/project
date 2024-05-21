'use client';

import classNames from 'classnames';
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from 'react';

import GalleryDownloadIcon from '@/shared/assets/icons/GalleryDownload';
import HeartPlusIcon from '@/shared/assets/icons/HeartPlus';
import { UploadedFile, UploadedReaction } from '@/shared/types';
import Button from '@/shared/ui/Button';
import FileInput from '@/shared/ui/FileInput/FileInput';

const formWidth = 450;

type PropTypes = {
  uploadedReactions: UploadedReaction[] | undefined;
  setUploadedReactions: Dispatch<SetStateAction<UploadedReaction[] | undefined>>;
};
type Errors = {
  image: string;
};

const emptyFile: UploadedFile = { src: '', type: 'image', file: undefined };

const AddReaction = ({ uploadedReactions, setUploadedReactions }: PropTypes) => {
  const [reaction, setReaction] = useState<UploadedReaction | undefined>();
  const [localReactions, setLocalReactions] = useState<UploadedReaction[] | undefined>();
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [reactionName, setReactionName] = useState('');
  const [formPosition, setFormPosition] = useState(1); //-1 left; 0 - center; 1- right;
  const [formOffset, setFormOffset] = useState(0); //offset relative to left of plus sign
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[] | undefined>();
  const [errors, setErrors] = useState<Errors>({ image: '' });

  useEffect(() => {
    const filteredReactions = localReactions?.filter((file) => file.src !== reaction?.src) || [];
    const newReaction = {
      name: reactionName,
      ...(!uploadedImages?.length ? emptyFile : uploadedImages?.[0]),
    };
    setLocalReactions(() => [...filteredReactions, { ...newReaction }]);
    setReaction(() => ({ ...newReaction }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedImages, reactionName]);

  const handleAddClick = () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    if (!localReactions?.length) return;
    setUploadedReactions(() => [
      ...(!uploadedReactions?.length ? [] : uploadedReactions),
      ...localReactions,
    ]);
    setReaction(undefined);
    setLocalReactions(undefined);
    setAddFormVisible(false);
    setReactionName('');
    setUploadedImages(undefined);
  };

  const calculateFormPosition = (e: MouseEvent<HTMLDivElement>) => {
    const availableWidthFromRight =
      window.innerWidth - e.currentTarget.getBoundingClientRect().left;
    const availableWidthFromLeft = e.currentTarget.getBoundingClientRect().left;

    let position = 0;
    let offset = 0;
    if (availableWidthFromLeft < formWidth && availableWidthFromRight < formWidth) {
      //display form below plus sign
      position = 0;
      offset = Math.round(
        window.innerWidth / 2 - e.currentTarget.getBoundingClientRect().left - 194,
      );
    } else if (availableWidthFromRight > formWidth) {
      //display form to the right of plus sign
      position = 1;
      offset = 15;
    } else {
      //display form to the left of plus sign
      position = -1;
      offset = -350;
    }
    return { position, offset };
  };

  const validateForm = () => {
    setErrors(() => ({ image: '' }));
    if (!localReactions?.length) {
      setErrors(() => ({ image: 'Unknown error' }));
      return false;
    }

    const reaction = localReactions[0];

    if (!reaction.src) {
      setErrors(() => ({ image: 'Icon is required' }));
      return false;
    }

    return true;
  };

  return (
    <>
      <div
        className="w-8 h-8 rounded-full bg-white flex flex-col items-center justify-center cursor-pointer z-10"
        onClick={(e) => {
          e.stopPropagation();

          const { position, offset } = calculateFormPosition(e);
          setFormOffset(offset);
          setFormPosition(position);
          setAddFormVisible(!addFormVisible);
        }}
      >
        <div className="mb-[1px]">
          <HeartPlusIcon fill="#78E378" />
        </div>
        {addFormVisible && (
          <div
            className="relative"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div
              className={classNames(
                'absolute flex flex-col gap-3 bg-white p-5 rounded-bl-3xl rounded-br-3xl z-10 drop-shadow',
                formPosition === 0 && 'top-[20px] rounded-tl-3xl rounded-tr-3xl items-center',
                formPosition === -1 && 'top-[8px] rounded-tl-3xl',
                formPosition === 1 && 'top-[8px] rounded-tr-3xl',
              )}
              style={{ left: `${formOffset}px` }}
            >
              <div className="flex flex-row gap-3 h-6 items-center">
                <input
                  value={reactionName}
                  autoComplete="off"
                  onChange={(e) => {
                    setReactionName(e.target.value);
                  }}
                  className="rounded-full px-3 bg-[#EFEFEF] h-8 w-64"
                  placeholder="Название реакции"
                />
                <FileInput
                  uploadedFiles={uploadedImages}
                  setUploadedFiles={setUploadedImages}
                  acceptType="image"
                  icon={<GalleryDownloadIcon />}
                  size="32"
                  tooltipHidden
                />
              </div>
              {!errors.image ? null : (
                <div className="text-red-700 w-full flex flex-row justify-center">
                  {errors.image}
                </div>
              )}
              <Button
                buttonRadius={'rounded-3xl'}
                buttonSize="s"
                className="p-2"
                onClick={handleAddClick}
                type={'button'}
              >
                Добавить реакции
              </Button>
            </div>
          </div>
        )}
      </div>

      {addFormVisible && (
        <div
          className="fixed w-screen h-screen top-0 left-0"
          onClick={() => setAddFormVisible(false)}
        />
      )}
    </>
  );
};

export default AddReaction;
