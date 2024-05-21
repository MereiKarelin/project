import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const ExitIcon = ({ className, fill, ...otherProps }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0_3928_13393)">
        <path
          d="M1.33496 7.99951L10.6683 7.99951M10.6683 7.99951L8.33496 5.99951M10.6683 7.99951L8.33496 9.99951"
          stroke={fill}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.00195 4.66683C6.01002 3.21681 6.07433 2.43154 6.58658 1.91928C7.17237 1.3335 8.11518 1.3335 10.0008 1.3335L10.6675 1.3335C12.5531 1.3335 13.4959 1.3335 14.0817 1.91928C14.6675 2.50507 14.6675 3.44788 14.6675 5.3335L14.6675 10.6668C14.6675 12.5524 14.6675 13.4953 14.0817 14.081C13.5694 14.5933 12.7841 14.6576 11.334 14.6657M6.00195 11.3335C6.01002 12.7835 6.07433 13.5688 6.58658 14.081C7.0141 14.5086 7.63177 14.6241 8.66732 14.6553"
          stroke={fill}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3928_13393">
          <rect x="0.000976562" width="16" height="16" rx="5" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ExitIcon;
