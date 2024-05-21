import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const SmileEmojiIcon = ({ className, fill, ...otherProps }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      {...otherProps}
    >
      <path
        d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30Z"
        stroke={fill || '#DAE1E7'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.7988 11.8008H11.8128"
        stroke={fill || '#DAE1E7'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.1992 11.8008H20.2132"
        stroke={fill || '#DAE1E7'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.4004 19.8008C10.4004 19.8008 12.5004 22.6008 16.0004 22.6008C19.5004 22.6008 21.6004 19.8008 21.6004 19.8008"
        stroke={fill || '#DAE1E7'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SmileEmojiIcon;
