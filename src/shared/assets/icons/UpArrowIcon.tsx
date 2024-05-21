import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const UpArrowIcon = ({ className, fill, ...otherProps }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="17"
      viewBox="0 0 30 17"
      fill={fill || '#DAE1E7'}
      {...otherProps}
      className={className}
    >
      <path
        d="M16.4142 0.585786C15.6332 -0.195262 14.3668 -0.195262 13.5858 0.585786L0.857864 13.3137C0.0768156 14.0948 0.0768156 15.3611 0.857864 16.1421C1.63891 16.9232 2.90524 16.9232 3.68629 16.1421L15 4.82843L26.3137 16.1421C27.0948 16.9232 28.3611 16.9232 29.1421 16.1421C29.9232 15.3611 29.9232 14.0948 29.1421 13.3137L16.4142 0.585786ZM17 3V2L13 2V3H17Z"
        fill={fill || '#DAE1E7'}
      />
    </svg>
  );
};

export default UpArrowIcon;
