import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}
const TextIcon = ({ className, fill, ...otherProps }: IProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={fill}>
      <path
        d="M12 3H8C6.11438 3 5.17157 3 4.58579 3.58579C4 4.17157 4 5.11438 4 7V7.95M12 3H16C17.8856 3 18.8284 3 19.4142 3.58579C20 4.17157 20 5.11438 20 7V7.95M12 3V8M12 21V12"
        stroke="#1C274C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 21H17"
        stroke="#1C274C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TextIcon;
