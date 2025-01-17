import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const LetterUnreadIcon = ({ className, fill, ...otherProps }: IProps) => {
  return (
    <svg
      className={className}
      {...otherProps}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill={fill || 'none'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.33398 7.99984C1.33398 10.514 1.33398 11.7711 2.11503 12.5521C2.89608 13.3332 4.15316 13.3332 6.66732 13.3332H9.33398C11.8481 13.3332 13.1052 13.3332 13.8863 12.5521C14.6673 11.7711 14.6673 10.514 14.6673 7.99984C14.6673 7.36933 14.6796 7.15121 14.6673 6.6665M8.66732 2.6665H6.66732C4.15316 2.6665 2.89608 2.6665 2.11503 3.44755C1.67958 3.88301 1.4869 4.46643 1.40165 5.33317"
        stroke="#011627"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4 5.3335L5.10959 6.25815M10.5607 6.53288C9.33631 7.55324 8.7241 8.06341 8 8.06341C7.56713 8.06341 7.17425 7.88109 6.66667 7.51646"
        stroke="#011627"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12.666" cy="3.3335" r="2" stroke="#011627" strokeWidth="1.5" />
    </svg>
  );
};

export default LetterUnreadIcon;
