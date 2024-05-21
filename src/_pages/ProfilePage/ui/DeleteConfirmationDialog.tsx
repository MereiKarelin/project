import { Dispatch, SetStateAction } from 'react';

import { ModalWrapper } from '@/shared/ui';
import { Button } from '@/shared/ui/ButtonNew';

type PropTypes = {
  isConfirmed: boolean;
  setIsConfirmed: Dispatch<SetStateAction<boolean>>;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteConfirmationDialog = ({
  isConfirmed,
  setIsConfirmed,
  isModalOpen,
  setIsModalOpen,
}: PropTypes) => {
  return (
    <ModalWrapper isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
      <div
        className="bg-white p-10 rounded-xl flex flex-col justify-center items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <span>Вы действительно хотите удалить этот шаблон?</span>
        <div className="flex flex-row justify-center items-center gap-2">
          <Button
            onClick={() => {
              setIsConfirmed(true);
              setIsModalOpen(false);
            }}
          >
            Да
          </Button>
          <Button
            onClick={() => {
              setIsConfirmed(false);
              setIsModalOpen(false);
            }}
          >
            Нет
          </Button>
          <Button
            onClick={() => {
              setIsConfirmed(false);
              setIsModalOpen(false);
            }}
          >
            Отмена
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
};
