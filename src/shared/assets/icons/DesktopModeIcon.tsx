import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const DesktopModeIcon = ({ className, fill, ...otherProps }: IProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <g clipPath="url(#clip0_3910_13234)">
        <path
          d="M3.3335 1.50101C2.81716 1.61341 2.42761 1.80099 2.11454 2.11406C1.3335 2.89511 1.3335 4.15218 1.3335 6.66634V7.33301C1.3335 9.21863 1.3335 10.1614 1.91928 10.7472C2.50507 11.333 3.44788 11.333 5.3335 11.333H10.6668C12.5524 11.333 13.4953 11.333 14.081 10.7472C14.6668 10.1614 14.6668 9.21863 14.6668 7.33301V6.66634C14.6668 4.15218 14.6668 2.89511 13.8858 2.11406C13.1047 1.33301 11.8477 1.33301 9.3335 1.33301H6.66683C6.43404 1.33301 6.21202 1.33301 6.00016 1.33363"
          stroke={fill}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M10.6668 14.667H5.3335" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 11.3337L8 14.667" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M14.6668 8.66699H10.6668M1.3335 8.66699H8.00016"
          stroke={fill}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3910_13234">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default DesktopModeIcon;
