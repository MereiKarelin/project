import { ReactNode } from 'react';

import { CloseIcon } from '@/shared/assets/icons';

type PropTypes = {
  isShown: boolean;
  isRemoveBtnShown: boolean;
  handleRemoveClick: () => void;
  children: ReactNode;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
};

export const CloseButton = ({
  isShown,
  isRemoveBtnShown,
  handleMouseEnter,
  handleMouseLeave,
  handleRemoveClick,
  children,
}: PropTypes) => {
  if (!isShown) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
    >
      {children}
      {isRemoveBtnShown && (
        <CloseIcon
          className="absolute right-[-24px] top-1 z-20"
          onClick={() => handleRemoveClick()}
          fill="#000"
          width={24}
        />
      )}
    </div>
  );
};
