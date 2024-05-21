import classNames from 'classnames';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { IPost } from '@/entities/Post/model/types';
import { useAuth } from '@/features/Auth/useAuth/useAuth';
import AddReaction from '@/features/Post/AddReaction/AddReaction';
import { repostPostHandler } from '@/features/Post/api/postApi';
// import VideoUpload from '@/features/UploadVideo/UploadVideo';
import VideoUpload from '@/features/UploadVideo/UploadVideo';
import { uploadImageHandler, uploadVideoHandler } from '@/shared/api/file';
import { createClassicPostHandler, createReactionStructureHandler } from '@/shared/api/post';
import GalleryDownloadIcon from '@/shared/assets/icons/GalleryDownload';
import { defaultReactionImage } from '@/shared/consts';
import { usePasteImages } from '@/shared/hooks/usePasteImages';
import { UploadedFile, UploadedReaction } from '@/shared/types';
import Button from '@/shared/ui/Button';
import FileInput from '@/shared/ui/FileInput/FileInput';
import ReactionCard from '@/shared/ui/ReactionCard/ReactionCard';
import { getId } from '@/shared/utils';
import { getUniqueFilesFromReactions } from '@/widgets/CreateClassicPostForm/utils';

type Props = {
  className?: string;
  appendPost: any;
  repostPost?: IPost | null;
  formType?: 'classic' | 'repost';
  closeRepostPopup?: () => void;
};

type FormData = {
  text?: string | null;
  image_url?: string | null;
  video_url?: string | null;
  with_default_reaction?: boolean | null;
};

type Errors = {
  backend: string;
  text: string;
  image: string;
  reactions: string;
  video: string;
};

type BackendErrors = {
  exc_data?: any;
  message?: string;
  exc_code?: string;
};

const emptyErrors = { backend: '', text: '', image: '', reactions: '', video: '' };

//TODO: let the user choose images from backend and local files

const CreateClassicPostForm = ({
  className,
  appendPost,
  repostPost,
  formType,
  closeRepostPopup,
}: Props) => {
  const [text, setText] = useState('');
  const [isFilesVisible, setIsFilesVisible] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[] | undefined>();
  const [video, setVideo] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>(emptyErrors);
  const [uploadedReactions, setUploadedReactions] = useState<UploadedReaction[]>();
  const [isFetchingResponse, setIsFetchingResponse] = useState(false);
  const { executeQueryCallback } = useAuth();

  const handlePaste = (imageFile: UploadedFile) => {
    setUploadedImages(() => [imageFile]);
    setIsFilesVisible(true);
  };

  usePasteImages('createPostTextarea', handlePaste);
  usePasteImages('createRepostTextarea', handlePaste);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isFetchingResponse) {
      return;
    }

    if (!uploadedImages && !text && !video) {
      alert('Для создания поста необходимо задать текст или картинку');
      return;
    }

    const currentErrors = { ...emptyErrors };
    setErrors(() => currentErrors);
    const isFormValid = validateForm(currentErrors);
    if (!isFormValid) {
      alert('Пожалуйста, исправьте ошибки.');
      return;
    }

    executeQueryCallback(async (accessToken: string) => {
      setIsFetchingResponse(true);

      //upload image
      const uploadedImage = uploadedImages?.[0];
      let updatedImage = uploadedImages?.[0];
      let videoUrl: string | null = null;
      try {
        if (video) {
          const formData = new FormData();
          formData.append('name', video.name);
          formData.append('file', video);
          //upload video
          const response = await uploadVideoHandler(formData, accessToken);
          videoUrl = response.url;
        }
        if (uploadedImage?.file) {
          const file = uploadedImage.file;
          const formData = new FormData();
          formData.append('name', file.name);
          formData.append('file', file);
          //upload image
          const response = await uploadImageHandler(formData, accessToken);
          setUploadedImages(() => [
            { type: uploadedImage.type, src: response.url, file: undefined },
          ]);
          updatedImage = { src: response.url, type: uploadedImage.type };
        }
        //upload reaction images

        let newReactionImages: UploadedFile[] | undefined =
          getUniqueFilesFromReactions(uploadedReactions);

        if (newReactionImages) {
          const responses = await Promise.all(
            newReactionImages.map((reaction) => {
              const formData = new FormData();
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const file = reaction.file!;
              formData.append('name', file.name);
              formData.append('file', file);
              return uploadImageHandler(formData, accessToken);
            }),
          );

          newReactionImages = newReactionImages.map((image) => {
            const imageFile = responses.filter(
              (serverImage) => serverImage.name === image?.file?.name,
            )?.[0];

            return { ...image, src: imageFile.url };
          });
        }

        const updatedReactions = uploadedReactions?.map((reaction) => {
          if (reaction.file) {
            //this file was uploaded to server
            if (!newReactionImages) {
              throw new Error(`Файл не загружен на сервер: ${reaction.file.name}`);
            }

            const newSrc = newReactionImages.filter(
              (image) => reaction?.file?.name === image?.file?.name,
            )?.[0].src;

            return { ...reaction, src: newSrc };
          }

          return reaction;
        });

        //if repost create default reaction
        //if no custom reactions created by user, use default reactions
        const withDefaultReaction = formType === 'repost' || !updatedReactions?.length;

        const responseBody: FormData = {
          text: text || null,
          image_url: updatedImage?.src || null,
          video_url: videoUrl || null,
          with_default_reaction: withDefaultReaction,
        };
        let responsePost: IPost | undefined;
        if (formType === 'repost') {
          responsePost = await repostPostHandler(
            accessToken,
            responseBody,
            repostPost?.reference as string,
          );
          closeRepostPopup?.();
        } else {
          responsePost = await createClassicPostHandler(responseBody, accessToken);
        }

        if (!responsePost) {
          throw new Error('Неизвестная ошибка');
        }

        const newPostReactions = [];

        if (updatedReactions) {
          const result = await Promise.all(
            updatedReactions.map((reaction) => {
              const requestBody = new FormData();
              requestBody.append('name', reaction.name);
              requestBody.append('icon_url', reaction.src);
              return createReactionStructureHandler(getId(responsePost), requestBody, accessToken);
            }),
          );

          newPostReactions.push(...result.flat());
        }

        if (withDefaultReaction && responsePost.reactions?.length) {
          const defaultReaction = responsePost.reactions[0];
          newPostReactions.push({
            reference: defaultReaction.reference,
            icon_url: defaultReactionImage,
            name: 'Like',
            created_at: new Date().toISOString(),
            user_reaction: null,
            total_reactions: 0,
          });
        }
        const newPost = { ...responsePost, reactions: [...newPostReactions] };

        appendPost(newPost);
        //clear post creation form
        setUploadedImages(undefined);
        setUploadedReactions(undefined);
        setText('');
        setVideo(null);
        setIsFilesVisible(false);
        setIsFetchingResponse(false);
        setErrors(() => ({ ...emptyErrors }));
      } catch (error: any) {
        handleBackendErrors(error?.response?.data);
        console.error(`Пост не может быть создан: ${error}`);
        alert('Пост не может быть создан.');
        setIsFetchingResponse(false);
        return;
      }
    });
  };

  const handleBackendErrors = (errors: BackendErrors) => {
    if (errors.exc_data?.text) {
      setErrors((state) => ({ ...state, text: errors.exc_data.text }));
    }
    if (errors.exc_code === 'ClassicPostHaveTooManyCharactersError') {
      setErrors((state) => ({ ...state, text: errors.message ?? '' }));
    }
    if (errors.exc_data?.image_url) {
      setErrors((state) => ({ ...state, image: errors.exc_data.image_url }));
    }
    if (errors.exc_data?.body) {
      setErrors((state) => ({ ...state, backend: errors.exc_data.body }));
    }
  };

  const validateForm = (errors: Errors) => {
    setErrors((state) => ({ ...state, text: '' }));
    if (text.length > 1000) {
      setErrors((state) => ({
        ...state,
        text: 'Слишком много символов, разрешено до 1000 символов.',
      }));
    }

    if (uploadedImages?.length) {
      setErrors((state) => ({ ...state, image: '' }));
    }

    for (const value of Object.values(errors)) {
      if (value.trim() !== '') {
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    validateForm(errors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, uploadedImages]);

  const createClassicPostForm = (
    <div>
      <form onSubmit={onSubmit} className={className}>
        <textarea
          id="createPostTextarea"
          placeholder="Что у вас нового?"
          onChange={(e) => {
            e.target.style.height = 'auto';
            setText(e.target.value);
            e.target.style.height = e.target.scrollHeight + 'px';
            setIsFilesVisible(true);
          }}
          value={text}
          maxLength={1000}
          className="w-full mb-2 pl-2 pr-2 overflow-hidden resize-none"
        />

        {!errors.text ? null : <div className="text-red-700">{errors.text}</div>}

        <div
          className={classNames(
            'flex',
            isFilesVisible ? 'flex-col items-start gap-3' : 'flex-row justify-between',
          )}
        >
          <div className="flex flex-row gap-3 w-full">
            <div className="w-full flex flex-col gap-3 items-start">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/2/21/Antu_applications-office.svg"
                alt=""
                width={40}
                height={40}
                onClick={() => {
                  setIsFilesVisible(!isFilesVisible);
                }}
                className="z-10"
              />

              {isFilesVisible && (
                <>
                  <div>
                    <span className="font-bold">Картинка (Максимум одно изображение)</span>
                    <FileInput
                      uploadedFiles={uploadedImages}
                      setUploadedFiles={setUploadedImages}
                      acceptType="image"
                      icon={<GalleryDownloadIcon />}
                      onRemoveClick={() => {
                        setUploadedImages(() => undefined);
                      }}
                    />
                    {!errors.image ? null : <div className="text-red-700">{errors.image}</div>}
                  </div>
                  <div>
                    <span>Видео</span>
                    <VideoUpload video={video} setVideo={setVideo} />
                    {!errors.video ? null : <div className="text-red-700">{errors.video}</div>}
                  </div>
                  <div className="relative flex flex-col gap-3">
                    <span className="font-bold">Реакции</span>

                    <div className="flex flex-row gap-3 flex-wrap items-center">
                      {uploadedReactions?.map((reaction, idx) => (
                        <div key={idx}>
                          <ReactionCard
                            reaction={{
                              name: reaction.name,
                              icon_url: reaction.src,
                              total_reactions: 0,
                              id: -1,
                              reference: '',
                              created_at: '',
                              user_reaction: null,
                            }}
                            className="flex flex-col gap-2 p-2 rounded-2xl min-w-[64px] items-center text-xs bg-[#C8C8C8]"
                          />
                        </div>
                      ))}
                      <AddReaction
                        uploadedReactions={uploadedReactions}
                        setUploadedReactions={setUploadedReactions}
                      />
                    </div>
                  </div>
                  {!errors.reactions ? null : (
                    <div className="text-red-700">{errors.reactions}</div>
                  )}
                </>
              )}
            </div>
          </div>

          {!isFilesVisible || !errors.backend ? null : (
            <div className="text-red-700">{errors.backend}</div>
          )}

          <div className={`w-full flex flex-row justify-${isFilesVisible ? 'center' : 'end'}`}>
            <div className="relative w-32 overflow-hidden">
              <Button type="submit" buttonRadius={'rounded-3xl'} buttonSize="s" className="p-2">
                {!isFetchingResponse ? null : (
                  <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-slate-300 to-slate-100 animate-[moveGradient_1s_infinite] opacity-50 blur-xl" />
                )}
                Создать пост
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );

  const createRepostPostForm = (
    <div>
      <form onSubmit={onSubmit} className="">
        <textarea
          id="createRepostTextarea"
          placeholder="Что Вы об этом думаете?"
          onChange={(e) => {
            e.target.style.height = 'auto';
            setText(e.target.value);
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          value={text}
          className="w-full mb-2 pl-2 pr-2 overflow-hidden resize-none bg-gray-100 rounded-xl"
        />

        {!errors.text ? null : <div className="text-red-700">{errors.text}</div>}

        <div
          className={classNames(
            'flex',
            isFilesVisible ? 'flex-col items-start gap-3' : 'flex-row justify-between',
          )}
        >
          <div className="flex flex-row gap-3 w-full">
            <div className="w-full flex flex-col gap-3 items-start">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/2/21/Antu_applications-office.svg"
                alt=""
                width={40}
                height={40}
                onClick={() => {
                  setIsFilesVisible(!isFilesVisible);
                }}
                className="z-10"
              />

              {isFilesVisible && (
                <>
                  <div>
                    <span className="font-bold">Картинка (Максимум одно изображение)</span>
                    <FileInput
                      uploadedFiles={uploadedImages}
                      setUploadedFiles={setUploadedImages}
                      acceptType="image"
                      icon={<GalleryDownloadIcon />}
                      onRemoveClick={() => {
                        setUploadedImages(() => undefined);
                      }}
                    />
                    {!errors.image ? null : <div className="text-red-700">{errors.image}</div>}
                  </div>
                  <div>
                    <span>Видео</span>
                    <VideoUpload video={video} setVideo={setVideo} />
                    {!errors.video ? null : <div className="text-red-700">{errors.video}</div>}
                  </div>
                  <div className="relative flex flex-col gap-3">
                    <span className="font-bold">Реакции</span>

                    <div className="flex flex-row gap-3 flex-wrap items-center">
                      {uploadedReactions?.map((reaction, idx) => (
                        <div key={idx}>
                          <ReactionCard
                            reaction={{
                              name: reaction.name,
                              icon_url: reaction.src,
                              total_reactions: 0,
                              id: -1,
                              reference: '',
                              created_at: '',
                              user_reaction: null,
                            }}
                            className="flex flex-col gap-2 p-2 rounded-2xl min-w-[64px] items-center text-xs bg-[#C8C8C8]"
                          />
                        </div>
                      ))}
                      <AddReaction
                        uploadedReactions={uploadedReactions}
                        setUploadedReactions={setUploadedReactions}
                      />
                    </div>
                  </div>
                  {!errors.reactions ? null : (
                    <div className="text-red-700">{errors.reactions}</div>
                  )}
                </>
              )}
            </div>
          </div>

          {!isFilesVisible || !errors.backend ? null : (
            <div className="text-red-700">{errors.backend}</div>
          )}

          <div className={`w-full flex flex-row justify-${isFilesVisible ? 'center' : 'end'}`}>
            <div className="relative w-32 overflow-hidden">
              <Button type="submit" buttonRadius={'rounded-3xl'} buttonSize="s" className="p-2">
                {!isFetchingResponse ? null : (
                  <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-slate-300 to-slate-100 animate-[moveGradient_1s_infinite] opacity-50 blur-xl" />
                )}
                Поделиться
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );

  return <>{formType === 'repost' ? <>{createRepostPostForm}</> : <>{createClassicPostForm}</>}</>;
};
export default CreateClassicPostForm;
