import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const RightArrowIcon = ({ className, fill, ...otherProps }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="24"
      viewBox="0 0 18 24"
      fill="none"
      className={className}
      {...otherProps}
    >
      <path
        d="M2 10.5C1.17157 10.5 0.5 11.1716 0.5 12C0.5 12.8284 1.17157 13.5 2 13.5V10.5ZM17.0607 13.0607C17.6464 12.4749 17.6464 11.5251 17.0607 10.9393L7.51472 1.3934C6.92893 0.807611 5.97918 0.807611 5.3934 1.3934C4.80761 1.97919 4.80761 2.92893 5.3934 3.51472L13.8787 12L5.3934 20.4853C4.80761 21.0711 4.80761 22.0208 5.3934 22.6066C5.97918 23.1924 6.92893 23.1924 7.51472 22.6066L17.0607 13.0607ZM2 13.5H16V10.5H2V13.5Z"
        fill={fill || '#DAE1E7'}
      />
    </svg>
  );
};

export default RightArrowIcon;
