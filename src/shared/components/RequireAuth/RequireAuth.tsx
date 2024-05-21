'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/features/Auth/useAuth/useAuth';

interface IProps {
  children: JSX.Element;
}

export const RequireAuth = ({ children }: IProps) => {
  const router = useRouter();
  const { isLogged, isLoading } = useAuth();

  useEffect(() => {
    if (!isLogged && !isLoading) {
      router.push('/login', { scroll: false });
    }
  }, [isLogged, isLoading, router]);

  if (!isLogged) {
    return null;
  }

  return children;
};
