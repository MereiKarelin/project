import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}
const ChatIcon = ({ className, fill, strokeWidth, ...otherProps }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0_3945_16487)">
        <path
          d="M9.33333 4.7135C8.54887 4.25972 7.6381 4 6.66667 4C3.72115 4 1.33333 6.38781 1.33333 9.33333C1.33333 10.1865 1.53366 10.9929 1.88985 11.708C1.9845 11.898 2.016 12.1152 1.96113 12.3203L1.64347 13.5075C1.50558 14.0229 1.97707 14.4944 2.49245 14.3565L3.67967 14.0389C3.88476 13.984 4.10198 14.0155 4.29201 14.1102C5.00713 14.4663 5.8135 14.6667 6.66667 14.6667C9.61219 14.6667 12 12.2789 12 9.33333C12 8.3619 11.7403 7.45113 11.2865 6.66667"
          stroke={fill}
          strokeWidth={strokeWidth || '1.5'}
          strokeLinecap="round"
        />
        <path
          d="M12.0007 9.66805C12.045 9.64957 12.0889 9.63038 12.1325 9.61048C12.3739 9.50022 12.6447 9.45898 12.9011 9.52757L13.2184 9.61249C13.8626 9.78486 14.452 9.19549 14.2796 8.55126L14.1947 8.23391C14.1261 7.97754 14.1674 7.7067 14.2776 7.46531C14.5279 6.91749 14.6673 6.30844 14.6673 5.66683C14.6673 4.81744 14.4229 4.02513 14.0007 3.35637M6.33398 3.99723C6.98773 2.43282 8.53248 1.3335 10.334 1.3335C11.1931 1.3335 11.9938 1.58349 12.6673 2.01471"
          stroke={fill}
          strokeWidth={strokeWidth || '1.5'}
          strokeLinecap="round"
        />
        <path
          d="M4.34584 9.3335H4.35184M6.67299 9.3335H6.67899M9.00033 9.3335H9.00633"
          stroke={fill}
          strokeWidth={strokeWidth || '1.5'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3945_16487">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ChatIcon;
