import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}
const BellIcon = ({ className, fill, strokeWidth, ...otherProps }: IProps) => {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.618 15.6582C15.3547 15.4522 17.0293 15.0439 18.6177 14.4576C17.3007 12.9956 16.499 11.0602 16.499 8.9375V8.29509C16.4992 8.28007 16.4992 8.26504 16.4992 8.25C16.4992 5.21243 14.0368 2.75 10.9992 2.75C7.96165 2.75 5.49921 5.21243 5.49921 8.25L5.49903 8.9375C5.49903 11.0602 4.69738 12.9956 3.38032 14.4576C4.96883 15.044 6.64361 15.4523 8.38042 15.6583M13.618 15.6582C12.7592 15.7601 11.8852 15.8125 10.999 15.8125C10.113 15.8125 9.23911 15.7601 8.38042 15.6583M13.618 15.6582C13.7032 15.9235 13.7492 16.2064 13.7492 16.5C13.7492 18.0188 12.518 19.25 10.9992 19.25C9.48043 19.25 8.24921 18.0188 8.24921 16.5C8.24921 16.2064 8.29522 15.9236 8.38042 15.6583M2.86328 6.875C3.12662 5.30534 3.8332 3.88597 4.84992 2.75M17.1485 2.75C18.1652 3.88597 18.8718 5.30534 19.1351 6.875"
        stroke={fill || '#000'}
        strokeWidth={strokeWidth || '1.5'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BellIcon;
