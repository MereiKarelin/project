import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const RelationsIcon = ({ className, fill, strokeWidth, ...otherProps }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0_3945_16478)">
        <ellipse
          cx="8.00065"
          cy="4.00016"
          rx="2.66667"
          ry="2.66667"
          stroke={fill}
          strokeWidth={strokeWidth || '1.5'}
        />
        <path
          d="M12 5.99984C13.1046 5.99984 14 5.25365 14 4.33317C14 3.4127 13.1046 2.6665 12 2.6665"
          stroke={fill}
          strokeWidth={strokeWidth || '1.5'}
          strokeLinecap="round"
        />
        <path
          d="M4 5.99984C2.89543 5.99984 2 5.25365 2 4.33317C2 3.4127 2.89543 2.6665 4 2.6665"
          stroke={fill}
          strokeWidth={strokeWidth || '1.5'}
          strokeLinecap="round"
        />
        <ellipse
          cx="8"
          cy="11.3332"
          rx="4"
          ry="2.66667"
          stroke={fill}
          strokeWidth={strokeWidth || '1.5'}
        />
        <path
          d="M13.334 12.6668C14.5035 12.4104 15.334 11.7609 15.334 11.0002C15.334 10.2395 14.5035 9.58996 13.334 9.3335"
          stroke={fill}
          strokeWidth={strokeWidth || '1.5'}
          strokeLinecap="round"
        />
        <path
          d="M2.66602 12.6668C1.49652 12.4104 0.666016 11.7609 0.666016 11.0002C0.666016 10.2395 1.49652 9.58996 2.66602 9.3335"
          stroke={fill}
          strokeWidth={strokeWidth || '1.5'}
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3945_16478">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default RelationsIcon;
