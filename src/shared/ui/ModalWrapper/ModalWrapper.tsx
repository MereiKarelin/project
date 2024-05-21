import { Dispatch, ReactNode, SetStateAction } from 'react';

type PropTypes = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
};

export const ModalWrapper = ({ isModalOpen, setIsModalOpen, children }: PropTypes) => {
  if (!isModalOpen) return null;

  return (
    <div
      className="h-screen w-screen fixed top-0 left-0 flex flex-col items-center justify-center bg-black/50 overflow-hidden z-40"
      onClick={(e) => {
        e.stopPropagation();
        setIsModalOpen(false);
      }}
    >
      {children}
    </div>
  );
};
