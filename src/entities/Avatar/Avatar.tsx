import Image from 'next/image';
import { ComponentProps } from 'react';

import { IProfile } from '@/entities/Profile';

type PropTypes = ComponentProps<'div'> & {
  profile: IProfile | null;
  className?: string;
  isScaled?: boolean;
};

export const Avatar = ({
  profile,
  className = 'flex flex-col items-center justify-center',
  isScaled = false,
  ...props
}: PropTypes) => {
  const { style: styleProp, ...propsRest } = props;
  const divStyle = isScaled
    ? {
        width: 'calc(var(--viewport-width-scale)*160px)',
        height: 'calc(var(--viewport-width-scale)*160px)',
      }
    : {
        width: '160px',
        height: '160px',
      };

  return (
    <div className={className} style={{ ...styleProp, ...divStyle }} {...propsRest}>
      <Image
        src={
          profile?.user.avatar?.small_url ??
          'https://cdn.yourbandy.com/public/images/default-profile-avatar.png'
        }
        alt="avatar"
        width={0}
        height={0}
        sizes="100vw"
        className="rounded-[50%] w-[160px] h-[160px]"
      />
    </div>
  );
};
