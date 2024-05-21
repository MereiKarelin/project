import { useState } from 'react';

import { useAuth } from '@/features';
import { prefix, saveHtmlTemplate } from '@/widgets/Customizator/Editor/utils';

import type { EditorType, Tool } from '@/widgets/Customizator/Editor/types';
type PropTypes = {
  editorType: EditorType;
};

export const SaveTab: Tool = {
  id: 'Save',
  type: 'tab',
  icon: () => <span className="text-white text-xs">Sav</span>,
  title: 'Save',
  Component: ({ editorType }: PropTypes) => {
    const [templateName, setTemplateName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const { executeQueryCallback } = useAuth();
    const onHandleSave = () => {
      //do not allow multiple fetch queries to be sent
      if (isSaving) return;
      executeQueryCallback(async (accessToken: string) => {
        try {
          setIsSaving(true);
          await saveHtmlTemplate('profile', templateName, accessToken);
          alert('Шаблон сохранен');
        } catch (error) {
          alert('Шаблон не может быть сохранен');
          console.error(`Template save failed: ${error}`);
        }
        setIsSaving(false);
      });
    };

    return (
      <div className={prefix('font-tab')}>
        <div className="flex flex-col gap-2">
          {editorType === 'profile' && (
            <input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              type="text"
              className="py-1 px-2 outline-0 border-[1px] border-black rounded-md"
            />
          )}
          <button
            onClick={onHandleSave}
            className="bg-green-400 text-white font-bold rounded-md py-1 px-2 hover:bg-green-500 hover:text-gray-200 transition-all ease-in"
          >
            Save
          </button>
        </div>
      </div>
    );
  },
};
