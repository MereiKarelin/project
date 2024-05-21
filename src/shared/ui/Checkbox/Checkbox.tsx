import CircleIcon from '@/shared/assets/icons/CircleIcon';
import SelectedIcon from '@/shared/assets/icons/SelectedIcon';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface CheckboxProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

export const Checkbox = (props: CheckboxProps) => {
  const { text, isSelected, onClick } = props;
  return (
    <div
      className="flex gap-2 items-center hover:cursor-pointer hover:opacity-40 transition-all ease-in"
      onClick={onClick}
    >
      {isSelected ? <SelectedIcon width={24} height={25} /> : <CircleIcon />}
      <span>{text}</span>
    </div>
  );
};
