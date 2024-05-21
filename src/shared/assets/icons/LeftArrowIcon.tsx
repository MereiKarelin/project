import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const LeftArrowIcon = ({ className, fill, ...otherProps }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="24"
      viewBox="0 0 18 24"
      fill="none"
      {...otherProps}
      className={className}
    >
      <path
        d="M16 13.5C16.8284 13.5 17.5 12.8284 17.5 12C17.5 11.1716 16.8284 10.5 16 10.5V13.5ZM0.93934 10.9393C0.353554 11.5251 0.353554 12.4749 0.93934 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92893 13.1924 1.97919 12.6066 1.3934C12.0208 0.807611 11.0711 0.807611 10.4853 1.3934L0.93934 10.9393ZM16 10.5L2 10.5V13.5L16 13.5V10.5Z"
        fill={fill || '#DAE1E7'}
      />
    </svg>
  );
};

export default LeftArrowIcon;
