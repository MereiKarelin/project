type IconProps = { fill?: string; stroke?: string; width?: number; height?: number };

export const MoveToolIcon = ({ fill = '#fff', stroke = '#fff' }: IconProps) => (
  <svg viewBox="0 0 80 80">
    <path
      d="M 21,21 L 35,60 L 40,44 L 54,58 A 3,3 0,0,0, 58,54 L 44,40 L 60,35 L 21,21Z"
      fill={fill}
      strokeLinejoin="round"
      strokeWidth="3"
      stroke={stroke}
      style={{ transformOrigin: '42px 42px', transform: 'rotate(10deg)' }}
    />
  </svg>
);

export const TextToolIcon = ({ stroke = '#000' }: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 3H8C6.11438 3 5.17157 3 4.58579 3.58579C4 4.17157 4 5.11438 4 7V7.95M12 3H16C17.8856 3 18.8284 3 19.4142 3.58579C20 4.17157 20 5.11438 20 7V7.95M12 3V8M12 21V12"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 21H17"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CropToolIcon = ({ stroke = '#000' }: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 21C16.2426 21 18.364 21 19.682 19.682C21 18.364 21 16.2426 21 12M12 3C16.2426 3 18.364 3 19.682 4.31802C20.4976 5.13363 20.8085 6.25685 20.927 8"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M13 21H9C6.17157 21 4.75736 21 3.87868 20.1213C3 19.2426 3 17.8284 3 15L3 9C3 6.17157 3 4.75736 3.87868 3.87868C4.75736 3 6.17157 3 9 3L13 3"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="2.5 3"
    />
    <path d="M12 22L12 2" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const RectToolIcon = ({ fill = '#555', stroke = '#fff' }: IconProps) => (
  <svg viewBox="0 0 73 73">
    <path
      d="M16.5,21.5 h40 a0,0 0 0 1 0,0 v30 a0,0 0 0 1 -0,0 h-40 a0,0 0 0 1 -0,-0 v-30 a0,0 0 0 1 0,-0 z"
      strokeLinejoin="round"
      strokeWidth="3"
      stroke={stroke}
      fill={fill}
    />
  </svg>
);

export const RoundRectToolIcon = ({ fill = '#555', stroke = '#fff' }: IconProps) => (
  <svg viewBox="0 0 73 73">
    <path
      d="M26.5,21.5 h20 a10,10 0 0 1 10,10 v10 a10,10 0 0 1 -10,10 h-20 a10,10 0 0 1 -10,-10 v-10 a10,10 0 0 1 10,-10 z"
      strokeLinejoin="round"
      strokeWidth="3"
      stroke={stroke}
      fill={fill}
    />
  </svg>
);

export const EllipseToolIcon = ({ fill = '#555', stroke = '#fff' }: IconProps) => (
  <svg viewBox="0 0 73 73">
    <ellipse
      cx="36.5"
      cy="36.5"
      rx="20"
      ry="15"
      strokeLinejoin="round"
      strokeWidth="3"
      stroke={stroke}
      fill={fill}
    />
  </svg>
);

export const CropInsetToolIcon = ({ fill = '#555', stroke = '#fff' }: IconProps) => (
  <svg viewBox="0 0 73 73">
    <path
      d="M16.5,21.5 h40 a0,0 0 0 1 0,0 v30 a0,0 0 0 1 -0,0 h-40 a0,0 0 0 1 -0,-0 v-30 a0,0 0 0 1 0,-0 z"
      strokeLinejoin="round"
      strokeWidth="3"
      stroke={stroke}
      fill={fill}
    />
  </svg>
);

export const FeedIcon = ({ fill = 'none', stroke = '#000' }: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
    <g id="Broken / Essentional, UI / Feed">
      <path
        id="Vector"
        d="M20.965 7C20.8873 5.1277 20.6366 3.97975 19.8284 3.17157C18.6569 2 16.7712 2 13 2H11C7.22876 2 5.34315 2 4.17157 3.17157C3 4.34315 3 6.22876 3 10V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V11"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        id="Vector_2"
        d="M6 12C6 10.5858 6 9.87868 6.43934 9.43934C6.87868 9 7.58579 9 9 9H15C16.4142 9 17.1213 9 17.5607 9.43934C18 9.87868 18 10.5858 18 12V16C18 17.4142 18 18.1213 17.5607 18.5607C17.1213 19 16.4142 19 15 19H9C7.58579 19 6.87868 19 6.43934 18.5607C6 18.1213 6 17.4142 6 16V12Z"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path id="Vector_3" d="M7 6H12" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    </g>
  </svg>
);

export const CursorIcon = ({ stroke = '#000' }: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 4.94198C6.47561 4.02693 5.129 3.65381 4.39141 4.39141C3.55146 5.23136 4.15187 6.86106 5.3527 10.1205L7.3603 15.5696C7.96225 17.2035 8.26322 18.0204 8.92489 18.1658C9.58656 18.3111 10.2022 17.6955 11.4334 16.4643L12.6361 15.2616L16.5744 19.1999C16.9821 19.6077 17.186 19.8116 17.4135 19.9058C17.7168 20.0314 18.0575 20.0314 18.3608 19.9058C18.5882 19.8116 18.7921 19.6077 19.1999 19.1999C19.6077 18.7921 19.8116 18.5882 19.9058 18.3608C20.0314 18.0575 20.0314 17.7168 19.9058 17.4135C19.8116 17.186 19.6077 16.9821 19.1999 16.5744L15.2616 12.6361L16.4643 11.4334C17.6955 10.2022 18.3111 9.58656 18.1658 8.92489C18.0204 8.26322 17.2035 7.96225 15.5696 7.3603L13 6.41359"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const GalleryUploadIcon = ({ stroke = '#000' }: IconProps) => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.75 10.9376L3.28264 9.59657C4.08 8.89889 5.28174 8.9389 6.03092 9.68809L9.78443 13.4416C10.3858 14.0429 11.3323 14.1249 12.0281 13.6359L12.289 13.4526C13.2902 12.7489 14.6448 12.8305 15.5544 13.6491L18.375 16.1876"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14.875 9.625V1.75M14.875 9.625L17.5 7M14.875 9.625L12.25 7"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.25 10.5C19.25 14.6248 19.25 16.6872 17.9686 17.9686C16.6872 19.25 14.6248 19.25 10.5 19.25C6.37521 19.25 4.31282 19.25 3.03141 17.9686C1.75 16.6872 1.75 14.6248 1.75 10.5C1.75 9.5127 1.75 8.64356 1.76757 7.875M10.5 1.75C6.37521 1.75 4.31282 1.75 3.03141 3.03141C2.65969 3.40313 2.3958 3.84056 2.20846 4.375"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const CircleToolIcon = ({ stroke = '#000' }: IconProps) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.2917 2.12109C16.5129 2.95017 19.0488 5.48612 19.8779 8.7073"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M20.1666 11.0003C20.1666 12.8133 19.629 14.5856 18.6218 16.0931C17.6145 17.6005 16.1829 18.7754 14.5079 19.4692C12.8329 20.163 10.9898 20.3446 9.21165 19.9909C7.43349 19.6372 5.80015 18.7641 4.51817 17.4821C4.21022 17.1742 3.92587 16.846 3.66665 16.5003M2.00945 12.7887C1.65575 11.0105 1.83728 9.16738 2.53108 7.49239C3.22489 5.81741 4.3998 4.38577 5.90725 3.37852C7.4147 2.37128 9.18698 1.83366 11 1.83366"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const LayersToolIcon = ({ stroke = '#000' }: IconProps) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.80861 7.36773C3.49175 8.29448 2.33331 8.75785 2.33331 9.33366C2.33331 9.90947 3.49175 10.3728 5.80861 11.2996L9.08516 12.6102C11.402 13.537 12.5605 14.0003 14 14.0003C15.4395 14.0003 16.5979 13.537 18.9148 12.6102L22.1913 11.2996C24.5082 10.3728 25.6666 9.90947 25.6666 9.33366C25.6666 8.75785 24.5082 8.29448 22.1913 7.36773L18.9148 6.05711C16.5979 5.13037 15.4395 4.66699 14 4.66699C12.887 4.66699 11.9421 4.94396 10.5 5.49791"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M6.72713 11.667L5.80861 12.0344C3.49175 12.9611 2.33331 13.4245 2.33331 14.0003C2.33331 14.5761 3.49175 15.0395 5.80861 15.9663L9.08516 17.2769C11.402 18.2036 12.5605 18.667 14 18.667C15.4395 18.667 16.5979 18.2036 18.9148 17.2769L22.1913 15.9663C24.5082 15.0395 25.6666 14.5761 25.6666 14.0003C25.6666 13.4245 24.5082 12.9611 22.1913 12.0344L21.2728 11.667"
      stroke={stroke}
      strokeWidth="1.5"
    />
    <path
      d="M22.1913 20.6323C24.5082 19.7055 25.6666 19.2421 25.6666 18.6663C25.6666 18.0905 24.5082 17.6272 22.1913 16.7004L21.2728 16.333M6.72713 16.333L5.80861 16.7004C3.49175 17.6272 2.33331 18.0905 2.33331 18.6663C2.33331 19.2421 3.49175 19.7055 5.80861 20.6323L9.08516 21.9429C11.402 22.8696 12.5605 23.333 14 23.333C15.1129 23.333 16.0578 23.056 17.5 22.5021"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const FiltersToolIcon = ({ stroke = '#000', fill = '#000' }: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 20.2832C13.0615 21.2333 14.4633 21.811 16 21.811C19.3137 21.811 22 19.1247 22 15.811C22 13.0152 20.0878 10.6661 17.5 10"
      stroke={stroke}
      strokeWidth="1.5"
    />
    <path
      d="M9 2.80269C9.88252 2.29218 10.9071 2 12 2C15.3137 2 18 4.68629 18 8C18 11.3137 15.3137 14 12 14C8.68629 14 6 11.3137 6 8C6 7.29873 6.12031 6.62556 6.34141 6"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 22.0004V21.2504V22.0004ZM2 16.0004H1.25H2ZM2.15349 19.376C2.3609 19.7345 2.81969 19.857 3.17824 19.6496C3.53678 19.4422 3.65931 18.9834 3.4519 18.6249L2.15349 19.376ZM6.24994 20.9519C5.8594 20.8139 5.43091 21.0185 5.29287 21.4091C5.15484 21.7996 5.35953 22.2281 5.75007 22.3661L6.24994 20.9519ZM13.25 16.0004C13.25 18.8999 10.8995 21.2504 8 21.2504V22.7504C11.7279 22.7504 14.75 19.7283 14.75 16.0004H13.25ZM2.75 16.0004C2.75 13.5552 4.42242 11.4986 6.68694 10.9158L6.31306 9.46313C3.4019 10.2124 1.25 12.8542 1.25 16.0004H2.75ZM12.9058 14.1261C13.1279 14.7072 13.25 15.3387 13.25 16.0004H14.75C14.75 15.1528 14.5934 14.3399 14.3069 13.5905L12.9058 14.1261ZM3.4519 18.6249C3.00564 17.8534 2.75 16.9579 2.75 16.0004H1.25C1.25 17.2286 1.57872 18.3824 2.15349 19.376L3.4519 18.6249ZM8 21.2504C7.38505 21.2504 6.79634 21.145 6.24994 20.9519L5.75007 22.3661C6.45478 22.6152 7.21241 22.7504 8 22.7504V21.2504Z"
      fill={fill}
    />
    <path
      d="M5.66846 15.7871C6.16533 16.3076 6.66968 16.7071 7.29555 17.0548C7.60018 17.2241 7.93999 17.3256 8.26122 17.4583C8.46186 17.5411 8.62944 17.6286 8.84327 17.6523"
      stroke="#78E378"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M18.249 15.0332C18.249 15.799 18.54 16.6553 17.9712 17.2953C17.7207 17.5771 17.5838 18.0446 17.2568 18.208"
      stroke="#4EB4FF"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M11.9067 6.03125C11.4902 6.05902 10.9512 6.04415 10.5847 6.27267C10.436 6.36536 10.322 6.52237 10.2168 6.65971C9.99032 6.95537 9.90915 7.5178 10.1478 7.82465C10.4522 8.21602 10.9479 8.34198 11.4411 8.34198C11.958 8.34198 12.2947 8.21365 12.493 7.72885C12.6114 7.43954 12.5262 6.87556 12.2171 6.72102"
      stroke="#FF4E4E"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const AlignmentToolIcon = ({ stroke = '#000' }: IconProps) => (
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

export const ExpandMenuToolIcon = ({ stroke = '#000' }: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const ChangeBGToolIcon = ({ stroke = '#000', height = 67 }: IconProps) => {
  const magnification = height / 67;
  return (
    <svg
      width={(magnification * 76).toString()}
      height={(magnification * 67).toString()}
      viewBox="0 0 76 67"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.125 43.9688L23.4619 29.5665C26.2444 27.1135 30.7557 27.1135 33.5381 29.5665L49.875 43.9688M45.125 39.7812L49.5869 35.8478C52.3694 33.3948 56.8807 33.3948 59.6631 35.8478L68.875 43.9688M11.875 54.4375H64.125C66.7484 54.4375 68.875 52.5627 68.875 50.25V16.75C68.875 14.4373 66.7484 12.5625 64.125 12.5625H11.875C9.25165 12.5625 7.125 14.4373 7.125 16.75V50.25C7.125 52.5627 9.25165 54.4375 11.875 54.4375ZM45.125 23.0312H45.1488V23.0522H45.125V23.0312ZM46.3125 23.0312C46.3125 23.6094 45.7808 24.0781 45.125 24.0781C44.4692 24.0781 43.9375 23.6094 43.9375 23.0312C43.9375 22.4531 44.4692 21.9844 45.125 21.9844C45.7808 21.9844 46.3125 22.4531 46.3125 23.0312Z"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
