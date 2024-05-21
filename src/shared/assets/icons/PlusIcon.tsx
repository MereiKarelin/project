import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const PlusIcon = ({ className, fill, ...otherProps }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      {...otherProps}
    >
      <path d="M1 10.6641H19" stroke={fill || '#DAE1E7'} strokeWidth="2" strokeLinecap="round" />
      <path
        d="M10 19.6641L10 1.66406"
        stroke={fill || '#DAE1E7'}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default PlusIcon;
