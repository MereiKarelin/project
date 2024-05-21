'use client';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';

import { AppStore, createStore } from '@/shared/store';
import { useAppDispatch } from '@/shared/store/hooks';
import { restoreUserData } from '@/shared/store/slices/user';

const LocalStorageConnector = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreUserData());
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading ? null : children;
};

export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createStore();
  }

  return (
    <Provider store={storeRef.current}>
      <LocalStorageConnector>{children}</LocalStorageConnector>
    </Provider>
  );
}
