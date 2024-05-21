type PropTypes = { fill?: string; stroke?: string; width?: number; height?: number };

export const GalleryUploadIcon = ({ stroke = '#000' }: PropTypes) => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.75 10.9376L3.28264 9.59657C4.08 8.89889 5.28174 8.9389 6.03092 9.68809L9.78443 13.4416C10.3858 14.0429 11.3323 14.1249 12.0281 13.6359L12.289 13.4526C13.2902 12.7489 14.6448 12.8305 15.5544 13.6491L18.375 16.1876"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
    ></path>
    <path
      d="M14.875 9.625V1.75M14.875 9.625L17.5 7M14.875 9.625L12.25 7"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M19.25 10.5C19.25 14.6248 19.25 16.6872 17.9686 17.9686C16.6872 19.25 14.6248 19.25 10.5 19.25C6.37521 19.25 4.31282 19.25 3.03141 17.9686C1.75 16.6872 1.75 14.6248 1.75 10.5C1.75 9.5127 1.75 8.64356 1.76757 7.875M10.5 1.75C6.37521 1.75 4.31282 1.75 3.03141 3.03141C2.65969 3.40313 2.3958 3.84056 2.20846 4.375"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
    ></path>
  </svg>
);
