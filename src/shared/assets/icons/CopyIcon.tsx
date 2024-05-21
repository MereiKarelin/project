import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}
const CopyIcon = ({ className, fill, strokeWidth }: IProps) => {
  return (
    <svg
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g stroke={fill || 'black'} strokeLinecap="round" strokeWidth={strokeWidth || '1.5'}>
        <path d="m20.9983 10c-.0121-2.17503-.1086-3.35294-.877-4.12132-.8787-.87868-2.2929-.87868-5.1213-.87868h-3c-2.82843 0-4.24264 0-5.12132.87868s-.87868 2.29289-.87868 5.12132v5c0 2.8284 0 4.2426.87868 5.1213s2.29289.8787 5.12132.8787h3c2.8284 0 4.2426 0 5.1213-.8787s.8787-2.2929.8787-5.1213v-1" />
        <path d="m3 10v6c0 1.6569 1.34315 3 3 3m12-14c0-1.65685-1.3431-3-3-3h-4c-3.77124 0-5.65685 0-6.82843 1.17157-.65318.65318-.9422 1.52832-1.07008 2.82843" />
      </g>
    </svg>
  );
};

export default CopyIcon;
