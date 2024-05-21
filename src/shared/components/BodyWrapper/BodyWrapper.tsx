'use client';

import classNames from 'classnames';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import { defaultBGImage } from '@/shared/consts';

const inter = Inter({ subsets: ['latin'] });

const matchProfilePath = (path: string) => {
  const pattern = /^(\/?[a-zA-Z]{0,2}\/)?profile(?:\/.*)?$/;
  return pattern.test(path);
};

export const BodyWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const className = classNames(
    inter.className,
    'bg-cover bg-fixed bg-center overflow-y-scroll min-w-full h-[100dvh]',
  );

  if (matchProfilePath(pathname)) {
    //do not apply default bg image
    return <body className={className}>{children}</body>;
  }

  return (
    <body className={className} style={{ backgroundImage: `url(${defaultBGImage})` }}>
      {children}
    </body>
  );
};
