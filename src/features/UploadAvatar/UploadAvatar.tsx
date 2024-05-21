import 'cropperjs/dist/cropper.css';

import { ChangeEvent, useState } from 'react';
import { Cropper } from 'react-cropper';

import { useAuth } from '@/features';
import { UpdateUserAvatarHandler } from '@/shared/api/avatar';

interface IProps {
  id: string;
}

export const UploadAvatar = ({ id }: IProps) => {
  const [generalFile, setGeneralFile] = useState<File | null>(null);
  const [cropper, setCropper] = useState<any>();
  const [editMode, setEditMode] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState('');
  const { executeQueryCallback } = useAuth();

  const getNewAvatarUrl = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGeneralFile(e.target.files[0]);
      setEditMode(true);
      setNewAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const getCropData = async () => {
    if (cropper) {
      const croppedFile = await fetch(cropper.getCroppedCanvas().toDataURL())
        .then((res) => res.blob())
        .then((blob) => {
          return new File([blob], 'newAvatar.png', { type: 'image/png' });
        });
      if (croppedFile) {
        executeQueryCallback(async (accessToken: string) => {
          const formData = new FormData();
          formData.append('cropped_file', croppedFile);
          formData.append('general_file', generalFile as Blob);
          await UpdateUserAvatarHandler(formData, accessToken);
          window.location.reload();
        });
      }
    }
  };

  return (
    <>
      <div>
        <input
          id={id}
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={getNewAvatarUrl}
          className="hidden"
        />
        {editMode && (
          <>
            <Cropper
              src={newAvatarUrl}
              style={{ height: 400, width: 400 }}
              initialAspectRatio={4 / 3}
              minCropBoxHeight={100}
              minCropBoxWidth={100}
              guides={false}
              checkOrientation={false}
              onInitialized={(instance) => {
                setCropper(instance);
              }}
            />
            <button
              className="mt-2 border border-solid border-black py-2 px-4 rounded cursor-pointer"
              onClick={getCropData}
            >
              Crop Image
            </button>
          </>
        )}
      </div>
    </>
  );
};
