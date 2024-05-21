'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuth } from '@/features/Auth/useAuth/useAuth';

interface IProps {
  children: JSX.Element;
}

export const RequireAnonymous = ({ children }: IProps) => {
  const router = useRouter();
  const { isLogged } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (isLogged) {
      router.push('/feed', { scroll: false });
    } else {
      setAuthChecked(true);
    }
  }, [isLogged, router]);

  if (!authChecked) {
    return null;
  }

  return children;
};
