import Link from 'next/link';
import { ComponentProps, CSSProperties, ReactNode } from 'react';

import { getShortCounterString } from '@/shared/utils';

type PropTypes = ComponentProps<'div'> & {
  count: number;
  caption: string;
  palleteCaption: string;
  href: string;
  isPalleteVersion: boolean;
  isScaled?: boolean;
  className?: string;
};

const PalleteWrapper = ({
  isPalleteVersion,
  palleteCaption,
  children,
}: {
  isPalleteVersion: boolean;
  palleteCaption: string;
  children: ReactNode;
}) => {
  if (!isPalleteVersion) {
    return children;
  }

  return (
    <div className="flex flex-row gap-3 bg-white rounded-xl h-28 items-center justify-between p-3 pr-6">
      {children}
      <span className="text-black text-2xl font-bold">{palleteCaption}</span>
    </div>
  );
};

const LinkWrapper = ({
  isScaled,
  href,
  children,
}: {
  isScaled: boolean;
  href: string;
  children: ReactNode;
}) => {
  if (!isScaled) {
    return children;
  }

  if (!href) return;
  return <Link href={href}>{children}</Link>;
};

export const Counter = ({
  caption,
  palleteCaption,
  count,
  href,
  isPalleteVersion = false,
  className = 'relative flex flex-row gap-3 items-center justify-center hover:shadow-[0_3px_10px_#818181] rounded-3xl h-min px-16 py-6 bg-cover bg-no-repeat bg-[#808080] hover:bg-[#808080]/70 text-white text-2xl font-bold whitespace-nowrap flex-grow-0',
  isScaled = false,
  ...props
}: PropTypes) => {
  const textStyle = (
    isScaled
      ? {
          fontSize: 'calc(var(--viewport-width-scale)*24px)',
          lineHeight: 'calc(var(--viewport-width-scale)*32px)',
        }
      : { fontSize: '24px', lineHeight: '32px' }
  ) as CSSProperties;

  const { style: styleProp, ...propsRest } = props;
  const divStyle = isScaled
    ? {
        gap: 'calc(var(--viewport-width-scale)*12px)',
        paddingLeft: 'calc(var(--viewport-width-scale)*64px)',
        paddingRight: 'calc(var(--viewport-width-scale)*64px)',
        paddingTop: 'calc(var(--viewport-width-scale)*24px)',
        paddingBottom: 'calc(var(--viewport-width-scale)*24px)',
        borderRadius: 'calc(var(--viewport-width-scale)*24px)',
      }
    : { gap: '12px' };

  return (
    <PalleteWrapper isPalleteVersion={isPalleteVersion} palleteCaption={palleteCaption}>
      <LinkWrapper isScaled={isScaled} href={href}>
        <div
          className={className}
          style={{
            ...styleProp,
            ...divStyle,
            position: isPalleteVersion ? 'relative' : styleProp?.position,
          }}
          {...propsRest}
          onClick={(e) => !isPalleteVersion && e.stopPropagation()}
        >
          <strong className="font-bold" style={{ display: 'block', ...textStyle }}>
            {caption}
          </strong>
          <span className="font-bold" style={{ display: 'block', ...textStyle }}>
            {getShortCounterString(count, true)}
          </span>
        </div>
      </LinkWrapper>
    </PalleteWrapper>
  );
};
