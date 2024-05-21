import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
  stroke?: string;
}

const HeartPlusIcon = ({ className, stroke = '#78E378' }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="16"
      viewBox="0 0 19 16"
      fill="none"
      className={className}
    >
      <path
        d="M11.1373 13.0401C9.71007 14.1738 8.52807 14.8015 8.52807 14.8015C8.52807 14.8015 1 10.8037 1 4.76404C1 2.68522 2.75543 1 4.92087 1C6.53992 1 7.92977 1.94208 8.52807 3.28638C9.12637 1.94208 10.5162 1 12.1353 1C14.0153 1 15.5863 2.27031 15.9678 3.96562"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="13.8945" y1="4.64648" x2="13.8945" y2="14.6839" stroke={stroke} strokeWidth="1.5" />
      <line x1="18.999" y1="9.5791" x2="8.96159" y2="9.5791" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
};

export default HeartPlusIcon;
