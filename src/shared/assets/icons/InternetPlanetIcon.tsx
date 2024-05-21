import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const InternetPlanetIcon = ({ className, fill, strokeWidth, ...otherProps }: IProps) => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.29232 3.47755C8.82447 2.59124 10.6034 2.08398 12.5007 2.08398C18.2536 2.08398 22.9173 6.74768 22.9173 12.5007C22.9173 18.2536 18.2536 22.9173 12.5007 22.9173C6.74768 22.9173 2.08398 18.2536 2.08398 12.5007C2.08398 10.6034 2.59124 8.82447 3.47755 7.29232"
        stroke={fill || 'black'}
        strokeWidth={strokeWidth || '1'}
        strokeLinecap="round"
      />
      <path
        d="M15.4469 19.8664C15.06 20.8337 14.6007 21.6009 14.0951 22.1244C13.5896 22.6478 13.0478 22.9173 12.5007 22.9173C11.9535 22.9173 11.4117 22.6478 10.9062 22.1244C10.4006 21.6009 9.94129 20.8337 9.55437 19.8664C9.16746 18.8991 8.86055 17.7508 8.65115 16.4869C8.44175 15.2232 8.33398 13.8686 8.33398 12.5007C8.33398 11.1327 8.44175 9.77817 8.65115 8.51437C8.86055 7.25056 9.16746 6.10223 9.55437 5.13495C9.94129 4.16768 10.4006 3.40039 10.9062 2.87691C11.4117 2.35342 11.9535 2.08398 12.5007 2.08398C13.0478 2.08398 13.5896 2.35342 14.0951 2.8769C14.6007 3.40039 15.06 4.16768 15.4469 5.13495C15.8339 6.10223 16.1408 7.25056 16.3501 8.51437C16.5595 9.77817 16.6673 11.1327 16.6673 12.5007C16.6673 13.8686 16.5595 15.2232 16.3501 16.4869"
        stroke={fill || 'black'}
        strokeWidth={strokeWidth || '1'}
        strokeLinecap="round"
      />
      <path
        d="M2.08398 12.5H10.4173M22.9173 12.5H14.584"
        stroke="#1C274C"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default InternetPlanetIcon;