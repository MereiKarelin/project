import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const FilterIcon = ({ className, fill, ...otherProps }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="20"
      viewBox="0 0 14 20"
      {...otherProps}
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 0C5.28365 0 3.5916 0.131881 1.93005 0.388071C0.805787 0.561417 0 1.76717 0 3.14576V19.0625C0 19.3847 0.132387 19.6844 0.35057 19.856C0.568753 20.0276 0.842152 20.0471 1.07455 19.9077L7 16.3524L12.9255 19.9077C13.1578 20.0471 13.4312 20.0276 13.6494 19.856C13.8676 19.6844 14 19.3847 14 19.0625V3.14576C14 1.76717 13.1942 0.561417 12.07 0.388071C10.4084 0.131881 8.71635 0 7 0Z"
        fill={fill || '#676E76'}
      />
    </svg>
  );
};

export default FilterIcon;
