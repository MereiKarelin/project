import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
  stroke?: string;
  width?: number;
}

const GalleryDownloadIcon = ({ className, stroke = '#78E378', width = 16, ...props }: IProps) => {
  const magnification = width / 16;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={(magnification * 16).toString()}
      height={(magnification * 16).toString()}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      {...props}
    >
      <g clipPath="url(#clip0_4321_12876)">
        <path
          d="M1.33301 8.33277L2.50073 7.31102C3.10825 6.77945 4.02386 6.80994 4.59466 7.38075L7.45448 10.2406C7.91264 10.6987 8.63384 10.7612 9.16394 10.3886L9.36274 10.2489C10.1256 9.71282 11.1576 9.77493 11.8507 10.3987L13.9997 12.3328"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M11.333 7.33301V1.33301M11.333 7.33301L13.333 5.33301M11.333 7.33301L9.33301 5.33301"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.6663 7.99967C14.6663 11.1424 14.6663 12.7137 13.69 13.69C12.7137 14.6663 11.1424 14.6663 7.99967 14.6663C4.85698 14.6663 3.28563 14.6663 2.30932 13.69C1.33301 12.7137 1.33301 11.1424 1.33301 7.99967C1.33301 7.24744 1.33301 6.58524 1.3464 5.99967M7.99967 1.33301C4.85698 1.33301 3.28563 1.33301 2.30932 2.30932C2.02611 2.59253 1.82505 2.92582 1.68231 3.33301"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4321_12876">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default GalleryDownloadIcon;
