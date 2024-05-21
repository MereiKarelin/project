import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const RightArrowIconLong = ({ className, fill, ...otherProps }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="24"
      viewBox="0 0 23 24"
      fill="none"
      {...otherProps}
      className={className}
    >
      <path
        d="M22.0607 13.0607C22.6464 12.4749 22.6464 11.5251 22.0607 10.9393L12.5147 1.3934C11.9289 0.807611 10.9792 0.807611 10.3934 1.3934C9.80761 1.97919 9.80761 2.92893 10.3934 3.51472L18.8787 12L10.3934 20.4853C9.80761 21.0711 9.80761 22.0208 10.3934 22.6066C10.9792 23.1924 11.9289 23.1924 12.5147 22.6066L22.0607 13.0607ZM0 13.5L21 13.5V10.5L0 10.5L0 13.5Z"
        fill={fill || '#DAE1E7'}
      />
    </svg>
  );
};

export default RightArrowIconLong;
