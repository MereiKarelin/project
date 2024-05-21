import { Button } from '@/shared/ui/ButtonNew';

type PropTypes = {
  deleteItem: () => void;
};

export const DeleteButton = ({ deleteItem }: PropTypes) => (
  <Button
    className="relative text-white hover:text-red-500 transition-all ease-out z-50"
    onClick={(e) => {
      e.stopPropagation();
      deleteItem();
    }}
  >
    Удалить
  </Button>
);
