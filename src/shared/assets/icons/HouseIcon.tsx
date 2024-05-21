import { SVGProps } from 'react';
interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const HouseIcon = ({ className, fill, strokeWidth, ...otherProps }: IProps) => {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.8327 23.834H2.16602"
        stroke="#1C274C"
        strokeWidth={strokeWidth || '1.0'}
        strokeLinecap="round"
      />
      <path
        d="M2.16602 11.9167L6.56756 8.39552M23.8327 11.9167L15.0296 4.87428C13.8426 3.92472 12.1561 3.92472 10.9691 4.87428L10.122 5.55196"
        stroke={fill || 'black'}
        strokeWidth={strokeWidth || '1.0'}
        strokeLinecap="round"
      />
      <path
        d="M16.791 5.95833V3.79167C16.791 3.49252 17.0336 3.25 17.3327 3.25H20.041C20.3401 3.25 20.5827 3.49252 20.5827 3.79167V9.20833"
        stroke={fill || 'black'}
        strokeWidth={strokeWidth || '1.0'}
        strokeLinecap="round"
      />
      <path
        d="M4.33203 23.8327V10.291"
        stroke="#1C274C"
        strokeWidth={strokeWidth || '1.0'}
        strokeLinecap="round"
      />
      <path
        d="M21.666 10.291V14.6243M21.666 23.8327V18.9577"
        stroke={fill || 'black'}
        strokeWidth={strokeWidth || '1.0'}
        strokeLinecap="round"
      />
      <path
        d="M16.25 23.8327V18.416C16.25 16.884 16.25 16.1179 15.7741 15.6419C15.2981 15.166 14.5321 15.166 13 15.166C11.468 15.166 10.7019 15.166 10.226 15.6419M9.75 23.8327V18.416"
        stroke={fill || 'black'}
        strokeWidth={strokeWidth || '1.0'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.1654 10.2917C15.1654 11.4883 14.1953 12.4583 12.9987 12.4583C11.802 12.4583 10.832 11.4883 10.832 10.2917C10.832 9.09505 11.802 8.125 12.9987 8.125C14.1953 8.125 15.1654 9.09505 15.1654 10.2917Z"
        stroke={fill || 'black'}
        strokeWidth={strokeWidth || '1.0'}
      />
    </svg>
  );
};

export default HouseIcon;
