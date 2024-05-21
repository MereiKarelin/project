import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';

import { EditorType } from '@/_pages/Customizator/types';
import { saveHtmlTemplate, saveProfileBackgroundImage } from '@/_pages/Customizator/utils';
import { useAuth } from '@/features';
import { CloseIcon } from '@/shared/assets/icons';
import { UploadedFile } from '@/shared/types';
import { Button } from '@/shared/ui/ButtonNew';

type PropTypes = {
  editorType: EditorType;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  bgImage: string;
  uploadedFiles: {
    [id: string]: UploadedFile;
  };
};

export const SaveDialog = ({
  editorType,
  isModalOpen,
  setIsModalOpen,
  bgImage,
  uploadedFiles,
}: PropTypes) => {
  const [isSaving, setIsSaving] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const router = useRouter();
  const { executeQueryCallback } = useAuth();

  if (!isModalOpen) return null;

  const handleSave = () => {
    //do not allow multiple fetch queries to be sent
    if (isSaving) return;
    if (!templateName) {
      alert('Необходимо задать название шаблона');
      return;
    }

    try {
      setIsSaving(true);
      executeQueryCallback(async (accessToken: string) => {
        const template = await saveHtmlTemplate(
          editorType,
          uploadedFiles,
          accessToken,
          templateName,
        );
        if (template && uploadedFiles[bgImage]) {
          await saveProfileBackgroundImage(template.reference, bgImage, uploadedFiles, accessToken);
        }
        alert('Шаблон сохранен');
        setIsModalOpen(false);
        router.push('/id', { scroll: false });
      });
    } catch (error) {
      alert('Шаблон не может быть сохранен');
      console.error(`Template save failed: ${error}`);
    }
    setIsSaving(false);
  };

  return (
    <div
      className="h-screen w-screen fixed top-0 flex flex-col items-center left-0 justify-center bg-black/50 overflow-hidden z-40"
      onClick={(e) => {
        e.stopPropagation();
        setIsModalOpen(false);
      }}
    >
      <div
        className="relative flex flex-col w-80 h-48 bg-white p-5 rounded-3xl overflow-hidden gap-5"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className="absolute right-5 top-5"
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          <CloseIcon />
        </div>
        <span className="text-base font-bold">Сохранение шаблона</span>
        <input
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="rounded-full px-3 bg-[#EFEFEF] h-8 w-full"
          placeholder="Название шаблона"
        />
        <Button size="s" textColor="secondary" onClick={handleSave}>
          Сохранить
        </Button>
      </div>
    </div>
  );
};
