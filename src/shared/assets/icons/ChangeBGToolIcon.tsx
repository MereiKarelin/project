type PropTypes = { fill?: string; stroke?: string; width?: number; height?: number };

export const ChangeBGToolIcon = ({ stroke = '#000', height = 67 }: PropTypes) => {
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
