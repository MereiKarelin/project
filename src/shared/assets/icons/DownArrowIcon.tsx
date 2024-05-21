import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const DownArrowIcon = ({ className, fill, ...otherProps }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      {...otherProps}
      className={className}
    >
      <path
        d="M4.47145 5.52827C4.2111 5.26792 3.78899 5.26792 3.52864 5.52827C3.26829 5.78862 3.26829 6.21073 3.52864 6.47108L7.52864 10.4711C7.78899 10.7314 8.2111 10.7314 8.47144 10.4711L12.4714 6.47108C12.7318 6.21073 12.7318 5.78862 12.4714 5.52827C12.2111 5.26792 11.789 5.26792 11.5286 5.52827L8.00004 9.05687L4.47145 5.52827Z"
        fill={fill || '#676E76'}
      />
    </svg>
  );
};

export default DownArrowIcon;
