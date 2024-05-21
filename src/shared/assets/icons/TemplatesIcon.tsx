import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const TemplatesIcon = ({ className, fill, ...otherProps }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="19"
      viewBox="0 0 14 19"
      {...otherProps}
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 0.5C10.866 0.5 14 2.29086 14 4.5C14 6.70914 10.866 8.5 7 8.5C3.13401 8.5 0 6.70914 0 4.5C0 2.29086 3.13401 0.5 7 0.5ZM12.694 8.63079C13.1576 8.36588 13.6044 8.04736 14 7.67775V9.5C14 11.7091 10.866 13.5 7 13.5C3.13401 13.5 0 11.7091 0 9.5V7.67775C0.395602 8.04736 0.842441 8.36588 1.30604 8.63079C2.83803 9.50621 4.85433 10 7 10C9.14567 10 11.162 9.50621 12.694 8.63079ZM0 12.6777V14.5C0 16.7091 3.13401 18.5 7 18.5C10.866 18.5 14 16.7091 14 14.5V12.6777C13.6044 13.0474 13.1576 13.3659 12.694 13.6308C11.162 14.5062 9.14567 15 7 15C4.85433 15 2.83803 14.5062 1.30604 13.6308C0.842441 13.3659 0.395602 13.0474 0 12.6777Z"
        fill={fill || '#676E76'}
      />
    </svg>
  );
};

export default TemplatesIcon;
