import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const HomeIcon = ({ className, fill, ...otherProps }: IProps) => {
  return (
    <svg
      className={className}
      {...otherProps}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_4032_4713)">
        <path d="M10 12H6" stroke="#011627" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M14.4246 8.63874L14.2388 9.93031C13.9138 12.1886 13.7513 13.3177 12.968 13.9923C12.1846 14.6668 11.0357 14.6668 8.73803 14.6668H7.26327C4.96556 14.6668 3.81671 14.6668 3.03334 13.9923C2.24996 13.3177 2.08749 12.1886 1.76254 9.93031L1.5767 8.63874C1.32374 6.88071 1.19725 6.00169 1.55756 5.25013C1.91787 4.49856 2.68478 4.04172 4.21859 3.12804L5.14182 2.57808C6.53468 1.74836 7.23111 1.3335 8.00065 1.3335C8.77019 1.3335 9.46662 1.74836 10.8595 2.57808L11.7827 3.12804C13.3165 4.04172 14.0834 4.49856 14.4437 5.25013"
          stroke="#011627"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4032_4713">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default HomeIcon;
