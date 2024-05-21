import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
  fill?: string;
  width?: number;
}
const SendIcon = ({ className, fill = '#00909E', width = 35, ...otherProps }: IProps) => {
  const magnification = width / 35;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={(magnification * 35).toString()}
      height={(magnification * 34).toString()}
      viewBox="0 0 35 34"
      fill="none"
      className={className}
      {...otherProps}
    >
      <rect x="0.769531" y="0.158203" width="33.6818" height="33.6818" rx="16.8409" fill={fill} />
      <path
        d="M11.3698 8.16117C11.1351 8.09301 10.882 8.15907 10.7106 8.33322C10.5391 8.50736 10.4771 8.76151 10.5489 8.99506L12.7048 16.0017H20.2529C20.62 16.0017 20.9176 16.2993 20.9176 16.6664C20.9176 17.0336 20.62 17.3312 20.2529 17.3312H12.7048L10.549 24.3376C10.4772 24.5712 10.5392 24.8253 10.7106 24.9995C10.8821 25.1736 11.1352 25.2397 11.3699 25.1715C17.3072 23.4466 22.821 20.7272 27.7189 17.206C27.8927 17.0811 27.9957 16.8802 27.9957 16.6662C27.9957 16.4523 27.8927 16.2514 27.7189 16.1265C22.821 12.6053 17.3072 9.88595 11.3698 8.16117Z"
        fill="#DAE1E7"
      />
    </svg>
  );
};

export default SendIcon;
