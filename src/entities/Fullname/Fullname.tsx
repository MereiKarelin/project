import { ComponentProps, CSSProperties } from 'react';

import { IProfile } from '@/entities/Profile';

type PropTypes = ComponentProps<'div'> & {
  profile: IProfile | null;
  isScaled?: boolean;
  className?: string;
};

export const Fullname = ({
  profile,
  className = 'flex flex-col items-center justify-center overflow-clip',
  isScaled = false,
  ...props
}: PropTypes) => {
  const usernameStyle = (
    isScaled
      ? {
          fontSize: 'calc(var(--viewport-width-scale)*24px)',
          lineHeight: 'calc(var(--viewport-width-scale)*32px)',
        }
      : { fontSize: '24px', lineHeight: '32px' }
  ) as CSSProperties;

  const fullnameStyle = (
    isScaled
      ? {
          fontSize: 'calc(var(--viewport-width-scale)*16px)',
          lineHeight: 'calc(var(--viewport-width-scale)*24px)',
        }
      : { fontSize: '16px', lineHeight: '24px' }
  ) as CSSProperties;
  const { style: styleProp, ...propsRest } = props;
  const divStyle = isScaled ? { gap: 'calc(var(--viewport-width-scale)*12px)' } : { gap: '12px' };

  return (
    <div className={className} style={{ ...styleProp, ...divStyle }} {...propsRest}>
      <strong className="font-bold" style={{ display: 'block', ...usernameStyle }}>
        {profile?.user.username ?? 'undefined'}
      </strong>
      {profile?.user.fullname && (
        <span className="font-bold" style={{ display: 'block', ...fullnameStyle }}>
          {profile?.user.fullname ?? 'undefined'}
        </span>
      )}
    </div>
  );
};
