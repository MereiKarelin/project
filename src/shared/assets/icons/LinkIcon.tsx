type PropTypes = {
  fill?: string;
  stroke?: string;
  width?: number;
  height?: number;
  className?: string;
};

export const LinkIcon = ({ stroke = '#fff', height = 35, className = '' }: PropTypes) => {
  const magnification = height / 35;
  return (
    <svg
      width={(magnification * 35).toString()}
      height={(magnification * 35).toString()}
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11.667 26.25C7.5422 26.25 5.47981 26.25 4.1984 24.9686C2.91699 23.6872 2.91699 21.6248 2.91699 17.5C2.91699 13.3752 2.91699 11.3128 4.1984 10.0314C5.47981 8.75 7.5422 8.75 11.667 8.75C15.7918 8.75 17.8542 8.75 19.1356 10.0314C20.417 11.3128 20.417 13.3752 20.417 17.5"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.583 17.5C14.583 21.6248 14.583 23.6872 15.8644 24.9686C17.1458 26.25 19.2082 26.25 23.333 26.25C27.4578 26.25 29.5202 26.25 30.8016 24.9686C31.2388 24.5314 31.5268 24.0033 31.7166 23.3333M32.083 17.5C32.083 13.3752 32.083 11.3128 30.8016 10.0314C29.5202 8.75 27.4578 8.75 23.333 8.75"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
