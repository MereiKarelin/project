import classNames from 'classnames';
import { Dispatch, MouseEvent, SetStateAction, useState } from 'react';

import { SubMenuPosition } from '@/entities/Post/ui/types';
import { IPrivateUser, IPublicUser } from '@/entities/User';
import { Overlay } from '@/shared/ui/Overlay/Overlay';
import { getId, getSubMenuPosition } from '@/shared/utils';

import { DeleteButton } from './DeleteButton';

type PropTypes = {
  userInfo: IPrivateUser | null | undefined;
  postUser: IPublicUser;
  deleteComment: () => void;
  menuIcon: JSX.Element;
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
};

export const PostMenu = ({
  userInfo,
  postUser,
  deleteComment,
  menuIcon,
  isMenuOpen,
  setIsMenuOpen,
}: PropTypes) => {
  const [subMenuPosition, setSubMenuPosition] = useState<SubMenuPosition>({
    offset: { left: 0, right: 0, top: 0, bottom: 0 },
    position: 'horizontalCenter',
  });

  const updateSubMenuPosition = (e: MouseEvent, submenuWidth: number) => {
    const currentTarget = e.currentTarget;
    if (!currentTarget) return;
    const boundingRect = currentTarget.getBoundingClientRect();
    const offset = { top: boundingRect.top };
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const position = getSubMenuPosition(boundingRect, submenuWidth, offset);
    const pos = {
      position: position.position,
      offset: {
        top: rect.top + 20,
        left: position.position === 'right' ? rect.left + 10 : rect.right - submenuWidth - 10,
      },
    };
    setSubMenuPosition(() => pos);
  };

  if (getId(postUser) !== userInfo?.reference) return null;

  return (
    <div className="relative p-2 flex items-start">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen((prev) => !prev);
          updateSubMenuPosition(e, 80);
        }}
      >
        {menuIcon}
      </button>

      <Overlay isVisible={isMenuOpen} onClick={() => setIsMenuOpen(false)}>
        <div
          className={classNames(
            'absolute bg-[#212330] p-2 transition-all ease-in-out z-20 top-8 rounded-b-xl',
            subMenuPosition.position === 'left' && 'right-[17px] rounded-l-xl',
            subMenuPosition.position === 'right' && 'left-[17px] rounded-r-xl',
            isMenuOpen ? 'block' : 'hidden',
          )}
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{
            top: `${subMenuPosition.offset.top}px`,
            left: `${subMenuPosition.offset.left}px`,
            width: '80px',
          }}
        >
          <DeleteButton deleteItem={deleteComment} />
        </div>
      </Overlay>
    </div>
  );
};
