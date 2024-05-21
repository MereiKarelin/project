import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const FeedIcon = ({ className, fill, strokeWidth, ...otherProps }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0_3948_26232)">
        <path
          d="M12.6668 10.6668C12.6668 12.5524 12.6668 13.4953 12.081 14.081C11.4953 14.6668 10.5524 14.6668 8.66683 14.6668H7.3335C5.44788 14.6668 4.50507 14.6668 3.91928 14.081C3.3335 13.4953 3.3335 12.5524 3.3335 10.6668V8.00016M3.3335 5.3335C3.3335 3.44788 3.3335 2.50507 3.91928 1.91928C4.50507 1.3335 5.44788 1.3335 7.3335 1.3335H8.66683C10.5524 1.3335 11.4953 1.3335 12.081 1.91928C12.6668 2.50507 12.6668 3.44788 12.6668 5.3335V8.00016"
          stroke={fill}
          strokeWidth={strokeWidth || '1.5'}
          strokeLinecap="round"
        />
        <path
          d="M3.3335 2.71729C2.68344 2.78123 2.24587 2.92573 1.91928 3.25233C1.3335 3.83811 1.3335 4.78092 1.3335 6.66654V9.33321C1.3335 11.2188 1.3335 12.1616 1.91928 12.7474C2.24587 13.074 2.68344 13.2185 3.3335 13.2825"
          stroke={fill}
          strokeWidth={strokeWidth || '1.5'}
        />
        <path
          d="M12.6665 2.71729C13.3166 2.78123 13.7541 2.92573 14.0807 3.25233C14.6665 3.83811 14.6665 4.78092 14.6665 6.66654V9.33321C14.6665 11.2188 14.6665 12.1616 14.0807 12.7474C13.7541 13.074 13.3166 13.2185 12.6665 13.2825"
          stroke={fill}
          strokeWidth={strokeWidth || '1.5'}
        />
        <path
          d="M6 8.6665H10"
          stroke={fill}
          strokeWidth={strokeWidth || '1.5'}
          strokeLinecap="round"
        />
        <path d="M6 6H10" stroke={fill} strokeWidth={strokeWidth || '1.5'} strokeLinecap="round" />
        <path
          d="M6 11.3335H8"
          stroke={fill}
          strokeWidth={strokeWidth || '1.5'}
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3948_26232">
          <rect width="16" height="16" rx="5" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default FeedIcon;
