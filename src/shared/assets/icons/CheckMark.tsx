import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
  width?: number;
}

const CheckMark = ({ className, fill, width = 12, ...otherProps }: IProps) => {
  const magnification = width / 12;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={(magnification * 12).toString()}
      height={(magnification * 10).toString()}
      className={className}
      viewBox="0 0 17 12"
      fill="none"
      {...otherProps}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.7071 0.292893C17.0976 0.683417 17.0976 1.31658 16.7071 1.70711L7.41421 11C6.63316 11.7811 5.36683 11.781 4.58579 11L0.292893 6.70711C-0.0976311 6.31658 -0.0976311 5.68342 0.292893 5.29289C0.683417 4.90237 1.31658 4.90237 1.70711 5.29289L6 9.58579L15.2929 0.292893C15.6834 -0.0976311 16.3166 -0.0976311 16.7071 0.292893Z"
        fill={fill}
      />
    </svg>
  );
};

export default CheckMark;
