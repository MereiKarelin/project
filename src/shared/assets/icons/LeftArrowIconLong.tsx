import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const LeftArrowIconLong = ({ className, fill, ...otherProps }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...otherProps}
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.3999 11.9998C20.3999 12.4969 19.997 12.8998 19.4999 12.8998L6.7344 12.8998L11.7237 17.6511C12.082 17.9956 12.0932 18.5653 11.7487 18.9236C11.4041 19.2819 10.8344 19.2931 10.4761 18.9486L3.87611 12.6486C3.69963 12.4789 3.5999 12.2446 3.5999 11.9998C3.5999 11.755 3.69963 11.5207 3.87611 11.3511L10.4761 5.05106C10.8344 4.70654 11.4041 4.71771 11.7487 5.07601C12.0932 5.4343 12.082 6.00404 11.7237 6.34856L6.7344 11.0998L19.4999 11.0998C19.997 11.0998 20.3999 11.5027 20.3999 11.9998Z"
        fill={fill || '#DAE1E7'}
      />
    </svg>
  );
};

export default LeftArrowIconLong;
