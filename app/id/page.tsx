'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAppSelector } from '@/shared/store/hooks';
import { userSelector } from '@/shared/store/selectors/user';
import { getStoredAccessToken } from '@/shared/utils';

const Redirect = () => {
  const router = useRouter();
  const currentUser = useAppSelector(userSelector);
  useEffect(() => {
    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      router.push('/login', { scroll: false });
      return;
    } else {
      router.push(`/id/${currentUser?.username}`, {
        scroll: false,
      });
    }
  }, [router, currentUser]);
};
export default Redirect;
