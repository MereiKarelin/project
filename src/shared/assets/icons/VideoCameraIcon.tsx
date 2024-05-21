import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}
const VideoCameraIcon = ({ className, fill, ...otherProps }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="16"
      viewBox="0 0 22 16"
      fill="none"
      {...otherProps}
    >
      <path
        d="M14.75 6.75L19.4697 2.03033C19.9421 1.55786 20.75 1.89248 20.75 2.56066V13.9393C20.75 14.6075 19.9421 14.9421 19.4697 14.4697L14.75 9.75M3.5 15H12.5C13.7426 15 14.75 13.9926 14.75 12.75V3.75C14.75 2.50736 13.7426 1.5 12.5 1.5H3.5C2.25736 1.5 1.25 2.50736 1.25 3.75V12.75C1.25 13.9926 2.25736 15 3.5 15Z"
        stroke="#00909E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default VideoCameraIcon;
