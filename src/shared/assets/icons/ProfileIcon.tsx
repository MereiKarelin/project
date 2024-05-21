import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const ProfileIcon = ({ className, fill, strokeWidth, ...otherProps }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0_3945_16481)">
        <circle cx="8" cy="6" r="2" stroke={fill} strokeWidth={strokeWidth || '1.5'} />
        <circle
          cx="8.00065"
          cy="8.00016"
          r="6.66667"
          stroke={fill}
          strokeWidth={strokeWidth || '1.5'}
        />
        <path
          d="M11.9804 13.3333C11.8743 11.4057 11.2841 10 8.00094 10C4.71778 10 4.12758 11.4057 4.02148 13.3333"
          stroke={fill}
          strokeWidth={strokeWidth || '1.5'}
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3945_16481">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ProfileIcon;
