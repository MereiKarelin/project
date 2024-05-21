interface IProps {
  className?: string;
  fill?: string;
  strokeWidth?: string;
}

const EyesOpenedIcon = ({ className, fill, strokeWidth }: IProps) => {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Broken / Security / Eye">
        <path
          id="Vector"
          d="M6.00065 2.97341C6.60833 2.78011 7.27427 2.66699 8.00065 2.66699C10.7886 2.66699 12.686 4.33336 13.8174 5.80321C14.384 6.53934 14.6673 6.90741 14.6673 8.00033C14.6673 9.09324 14.384 9.46131 13.8174 10.1974C12.686 11.6673 10.7886 13.3337 8.00065 13.3337C5.21273 13.3337 3.31529 11.6673 2.18391 10.1974C1.61729 9.46131 1.33398 9.09324 1.33398 8.00033C1.33398 6.90741 1.61729 6.53934 2.18391 5.80321C2.50473 5.38642 2.88714 4.95383 3.33398 4.54791"
          stroke={fill || '#1C274C'}
          strokeWidth={strokeWidth || '1.5'}
          strokeLinecap="round"
        />
        <path
          id="Vector_2"
          d="M10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6C9.10457 6 10 6.89543 10 8Z"
          stroke={fill || '#1C274C'}
          strokeWidth={strokeWidth || '1.5'}
        />
      </g>
    </svg>
  );
};

export default EyesOpenedIcon;
