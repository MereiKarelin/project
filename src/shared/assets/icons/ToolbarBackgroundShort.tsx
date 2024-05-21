import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
  flip?: boolean;
  variant: 'desktop' | 'mobile';
}

const ToolbarBackgroundShort = ({
  className,
  fill,
  variant,
  flip = false,
  ...otherProps
}: IProps) => {
  if (variant === 'mobile') {
    return (
      <svg
        width="414"
        height="64"
        viewBox="0 0 414 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_bd_4032_4686)">
          <path
            d="M0 0H414C414 30.9279 388.928 56 358 56H56C25.0721 56 0 30.9279 0 0Z"
            fill="#F5F5F5"
            shapeRendering="crispEdges"
          />
        </g>
        <defs>
          <filter
            id="filter0_bd_4032_4686"
            x="-20"
            y="-20"
            width="454"
            height="96"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="10" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_4032_4686"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0.338333 0 0 0 0 0.297733 0 0 0 0.15 0"
            />
            <feBlend
              mode="normal"
              in2="effect1_backgroundBlur_4032_4686"
              result="effect2_dropShadow_4032_4686"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect2_dropShadow_4032_4686"
              result="shape"
            />
          </filter>
          <clipPath id="clip0_4032_4686">
            <rect width="16" height="16" fill="white" transform="translate(334 20)" />
          </clipPath>
        </defs>
      </svg>
    );
  }

  if (flip) {
    return (
      <svg
        width="608"
        height="56"
        viewBox="0 0 608 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_bd_4032_5360)">
          <path
            d="M4 56C4 25.0721 29.0721 0 60 0H548C578.928 0 604 25.0721 604 56H4Z"
            fill="#F5F5F5"
          />
        </g>
        <defs>
          <filter
            id="filter0_bd_4032_5360"
            x="-16"
            y="-20"
            width="640"
            height="96"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="10" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_4032_5360"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0.338333 0 0 0 0 0.297733 0 0 0 0.15 0"
            />
            <feBlend
              mode="normal"
              in2="effect1_backgroundBlur_4032_5360"
              result="effect2_dropShadow_4032_5360"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect2_dropShadow_4032_5360"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      width="608"
      height="64"
      viewBox="0 0 608 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
      className={className}
    >
      <g filter="url(#filter0_bd_4032_5332)">
        <path
          d="M4 0H604C604 30.9279 578.928 56 548 56H60C29.072 56 4 30.9279 4 0Z"
          fill={fill || '#F5F5F5'}
          shapeRendering="crispEdges"
        />
      </g>

      <defs>
        <filter
          id="filter0_bd_4032_5332"
          x="-16"
          y="-20"
          width="640"
          height="96"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="10" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_4032_5332" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0.338333 0 0 0 0 0.297733 0 0 0 0.15 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_backgroundBlur_4032_5332"
            result="effect2_dropShadow_4032_5332"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_4032_5332"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_4032_5332">
          <rect width="16" height="16" fill="white" transform="translate(524 20)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ToolbarBackgroundShort;
