import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
  width?: number;
}

const CloseIcon = ({ className, fill, width = 24, ...otherProps }: IProps) => {
  const magnification = width / 24;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={Math.round(magnification * 24).toString()}
      height={Math.round(magnification * 24).toString()}
      viewBox="0 0 24 24"
      fill={fill || '#666666'}
      className={className}
      {...otherProps}
    >
      <g clipPath="url(#clip0_2157_2490)">
        <path
          d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
          fill={fill || '#666666'}
        />
      </g>
      <defs>
        <clipPath id="clip0_2157_2490">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default CloseIcon;
