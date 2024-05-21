import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}
const ForwardIcon = ({ className, fill, strokeWidth, ...otherProps }: IProps) => {
  return (
    <svg
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="m8.0001 10.1308c1.61334-1.15409 3.4546-1.56005 4.9999-1.56005v-2.34459c0-.95799 0-1.43699.2952-1.56954.2951-.13255.6532.18568 1.3692.82213l3.9723 3.53093c1.5686 1.39432 2.3529 2.09152 2.3529 2.98962 0 .8982-.7843 1.5953-2.3529 2.9897l-3.9723 3.5309c-.716.6364-1.0741.9547-1.3692.8221-.2952-.1325-.2952-.6115-.2952-1.5695v-2.3446c-3.6 0-7.5 1.7143-9 4.5714 0-2.4317.37726-4.3783 1.0001-5.9258"
        stroke={fill || 'black'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth || '1.5'}
      />
    </svg>
  );
};

export default ForwardIcon;
