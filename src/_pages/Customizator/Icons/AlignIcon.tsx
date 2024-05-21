type PropTypes = { fill?: string; stroke?: string; width?: number; height?: number };

export const AlignIcon = ({ stroke = '#000' }: PropTypes) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.33331 9.33301H9.33331M26.6666 9.33301H14.6666"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M26.6667 22.667H22.6667M5.33335 22.667L17.3334 22.667"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M5.33331 16H9.33331L26.6666 16"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
