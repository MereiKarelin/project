'use client';

import { Logo } from '@/shared/assets/icons';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="grid justify-center items-center">
      <Link href={'/'} className="grid justify-center items-center">
        <Logo fill={'black'} />
      </Link>
      <strong>Страница не найдена</strong>
    </div>
  );
};

export default NotFound;
