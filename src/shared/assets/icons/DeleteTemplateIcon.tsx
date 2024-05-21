const DeleteTemplateIcon = ({
  stroke = '#F5F5F5',
  width = 16,
}: {
  stroke?: string;
  width?: number;
}) => {
  const magnification = width / 16;
  return (
    <svg
      className="hover:cursor-pointer"
      xmlns="http://www.w3.org/2000/svg"
      width={(magnification * 16).toString()}
      height={(magnification * 16).toString()}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path d="M13.6674 4H2.33398" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M6.33398 7.3335L6.66732 10.6668"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9.66732 7.3335L9.33398 10.6668"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4.33398 4C4.37124 4 4.38986 4 4.40675 3.99957C4.95571 3.98566 5.44 3.63661 5.6268 3.12021C5.63254 3.10433 5.63843 3.08666 5.65021 3.05132L5.71494 2.85714C5.77019 2.69139 5.79782 2.6085 5.83446 2.53813C5.98066 2.25738 6.25115 2.06242 6.56372 2.01251C6.64207 2 6.72943 2 6.90416 2H9.09714C9.27187 2 9.35923 2 9.43758 2.01251C9.75016 2.06242 10.0206 2.25738 10.1668 2.53813C10.2035 2.6085 10.2311 2.69138 10.2864 2.85714L10.3511 3.05132C10.3629 3.08661 10.3688 3.10434 10.3745 3.12021C10.5613 3.63661 11.0456 3.98566 11.5946 3.99957C11.6114 4 11.6301 4 11.6673 4"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path
        d="M12.2498 10.2659C12.1318 12.0359 12.0728 12.9208 11.4961 13.4603C10.9195 13.9998 10.0325 13.9998 8.25866 13.9998H7.74308C5.96921 13.9998 5.08228 13.9998 4.50561 13.4603C3.92893 12.9208 3.86994 12.0359 3.75194 10.2659L3.44531 5.6665M12.5564 5.6665L12.4231 7.6665"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default DeleteTemplateIcon;
