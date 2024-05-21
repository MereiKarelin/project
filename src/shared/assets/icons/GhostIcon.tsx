type IconProps = { fill?: string; stroke?: string; width?: number };

export const GhostIcon = ({ fill = '#fff', stroke = '#fff', width = 18 }: IconProps) => {
  const magnification = width / 18;

  return (
    <svg
      width={(magnification * 18).toString()}
      height={(magnification * 18).toString()}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_4474_4983)">
        <path
          d="M12 7.875C12 8.49632 11.6642 9 11.25 9C10.8358 9 10.5 8.49632 10.5 7.875C10.5 7.25368 10.8358 6.75 11.25 6.75C11.6642 6.75 12 7.25368 12 7.875Z"
          fill={fill}
        />
        <ellipse cx="6.75" cy="7.875" rx="0.75" ry="1.125" fill={fill} />
        <path
          d="M16.5 9.22544C16.5 4.9588 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.9588 1.5 9.22544V14.7922C1.5 15.784 2.51323 16.429 3.3744 15.9855C4.07044 15.627 4.8996 15.6802 5.5471 16.1248C6.27552 16.6251 7.22448 16.6251 7.9529 16.1248L8.21739 15.9432C8.6913 15.6178 9.3087 15.6178 9.78261 15.9432L10.0471 16.1248C10.7755 16.6251 11.7245 16.6251 12.4529 16.1248C13.1004 15.6802 13.9296 15.627 14.6256 15.9855C15.4868 16.429 16.5 15.784 16.5 14.7922V12.0088"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4474_4983">
          <rect width="18" height="18" fill={fill} />
        </clipPath>
      </defs>
    </svg>
  );
};
