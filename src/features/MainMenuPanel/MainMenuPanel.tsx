import { BellIcon, BurgerIcon, Logo } from '@/shared/assets/icons';

type PropTypes = {
  openBurger: () => void;
  closeBurger: () => void;
  openPopupLoginForm: () => void;
  openNotifications: () => void;
  closeNotifications: () => void;
  isBurgerOpen: boolean;
  isLogged: boolean;
  isNotificationsOpen: boolean;
  totalUnreadNotifications: number;
};

export const MainMenuPanel = ({
  openBurger,
  closeBurger,
  openPopupLoginForm,
  openNotifications,
  closeNotifications,
  isBurgerOpen,
  isLogged,
  isNotificationsOpen,
  totalUnreadNotifications,
}: PropTypes) => {
  return (
    <div className="flex justify-between items-center">
      <button
        onClick={() => {
          if (!isBurgerOpen) {
            openBurger();
          } else {
            closeBurger();
          }
        }}
      >
        <BurgerIcon className="w-[30px] h-[30px]" fill="white" />
      </button>
      <Logo fill={'white'} />
      <div
        className="flex gap-3 text-white text-start cursor-pointer relative"
        onClick={() => {
          if (!isLogged) {
            openPopupLoginForm();
          } else {
            if (!isNotificationsOpen) {
              openNotifications();
            } else {
              closeNotifications();
            }
          }
        }}
      >
        <BellIcon className="w-[30px] h-[30px]" fill="white" />
        {totalUnreadNotifications === 0 ? null : (
          <div className="absolute top-[50%] right-0 bg-red-500 pr-2 pl-2 rounded-full">
            {totalUnreadNotifications}
          </div>
        )}
      </div>
    </div>
  );
};
