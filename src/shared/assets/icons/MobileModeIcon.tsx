import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const MobileModeIcon = ({ className, fill, ...otherProps }: IProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8.00016 2.66699L6.66683 2.66699C4.15267 2.66699 2.89559 2.66699 2.11454 3.44804C1.3335 4.22909 1.3335 5.48617 1.3335 8.00033C1.3335 10.5145 1.3335 11.7716 2.11454 12.5526C2.74327 13.1813 3.68045 13.304 5.3335 13.3279M10.6668 2.67279C12.3199 2.6967 13.2571 2.81932 13.8858 3.44804C14.6668 4.22909 14.6668 5.48617 14.6668 8.00033C14.6668 10.5145 14.6668 11.7716 13.8858 12.5526C13.1047 13.3337 11.8477 13.3337 9.3335 13.3337H8.00016"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M10 11.333H6" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export default MobileModeIcon;
