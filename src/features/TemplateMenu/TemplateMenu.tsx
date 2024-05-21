import classNames from 'classnames';
import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { ITemplate } from '@/entities/Template';
import { useAuth } from '@/features/Auth/useAuth/useAuth';
import {
  deleteProfileTemplateHandler,
  setActiveProfileTemplateHandler,
  setInactiveProfileTemplateHandler,
} from '@/shared/api/profile';
import { DeleteTemplateIcon } from '@/shared/assets/icons';
import { PenIcon } from '@/shared/assets/icons/PenIcon';
import { defaultBGImage } from '@/shared/consts';
import { changeBackground } from '@/shared/utils';

type PropTypes = {
  fetchTemplates: () => void;
  templates: ITemplate[] | undefined;
  isTemplateDropdownOpen: boolean;
  setActiveTemplate: Dispatch<SetStateAction<ITemplate | undefined>>;
  isConfirmed: boolean;
  setIsConfirmed: Dispatch<SetStateAction<boolean>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const TemplateMenu = ({
  fetchTemplates,
  templates,
  isTemplateDropdownOpen,
  setActiveTemplate,
  isConfirmed,
  setIsConfirmed,
  setIsModalOpen,
}: PropTypes) => {
  const { isLogged, executeQueryCallback } = useAuth();
  const [deletedId, setDeletedId] = useState('');

  const handleDeleteTemplate = (id: string) => {
    if (!isLogged) return;
    executeQueryCallback(async (accessToken: string) => {
      try {
        await deleteProfileTemplateHandler(id, accessToken).then(() => {
          void fetchTemplates();
        });
      } catch (err) {
        console.error(err);
      }
    });
  };

  useEffect(() => {
    if (!isConfirmed || !deletedId) return;

    void handleDeleteTemplate(deletedId);
    setDeletedId('');
    setIsConfirmed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed]);

  if (!isTemplateDropdownOpen) return null;

  const handleActivateTemplate = (template: ITemplate) => {
    if (!isLogged) return;
    executeQueryCallback(async (accessToken: string) => {
      const id = template.reference;
      if (template.is_active) {
        try {
          await setInactiveProfileTemplateHandler(id, accessToken);
          setActiveTemplate(undefined);
          changeBackground(null);
          void fetchTemplates();
        } catch (err) {
          console.error(err);
        }
      } else {
        try {
          await setActiveProfileTemplateHandler(id, accessToken);
          setActiveTemplate(template);
          changeBackground(template.background_url);
          void fetchTemplates();
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  return (
    <div
      className="flex flex-col w-full max-h-48 bg-transparent rounded-3xl overflow-hidden gap-5 p-4"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="flex flex-col gap-3 overflow-y-scroll h-full w-full">
        {templates?.map((template) => (
          <div
            key={template.reference}
            className="relative flex flex-col justify-end h-[75px] bg-cover bg-center shrink-0 rounded-lg cursor-pointer"
            style={{ backgroundImage: `url(${template.background_url ?? defaultBGImage})` }}
            onClick={(e) => {
              e.stopPropagation();
              void handleActivateTemplate(template);
            }}
          >
            <span
              className={classNames(
                'font-bold pl-3',
                template.is_active ? 'text-[#2DC96B]' : 'text-white',
              )}
            >
              {template.name}
            </span>
            <div className="absolute top-0 right-2 flex flex-col gap-2 justify-center h-full">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletedId(template.reference);
                  setIsModalOpen(true);
                }}
              >
                <DeleteTemplateIcon
                  width={27}
                  stroke={classNames(template.is_active ? '#2DC96B' : '#fff')}
                />
              </div>
              <Link
                href={`/customization/profile/${template.reference}`}
                onClick={(e) => e.stopPropagation()}
              >
                <PenIcon width={27} stroke={classNames(template.is_active ? '#2DC96B' : '#fff')} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
function fetchTemplates() {
  throw new Error('Function not implemented.');
}
