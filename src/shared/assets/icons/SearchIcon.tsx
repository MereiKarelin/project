import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const SearchIcon = ({ className, fill, ...otherProps }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...otherProps}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 2.25C5.94365 2.25 2.25 5.94365 2.25 10.5C2.25 15.0563 5.94365 18.75 10.5 18.75C12.7785 18.75 14.8394 17.8278 16.3336 16.3336C17.8278 14.8394 18.75 12.7785 18.75 10.5C18.75 5.94365 15.0563 2.25 10.5 2.25ZM0 10.5C0 4.70101 4.70101 0 10.5 0C16.299 0 21 4.70101 21 10.5C21 12.9938 20.1295 15.2858 18.6776 17.0866L23.6705 22.0795C24.1098 22.5188 24.1098 23.2312 23.6705 23.6705C23.2312 24.1098 22.5188 24.1098 22.0795 23.6705L17.0866 18.6776C15.2858 20.1295 12.9938 21 10.5 21C4.70101 21 0 16.299 0 10.5Z"
        fill={fill || '#00909E'}
      />
    </svg>
  );
};

export default SearchIcon;
