'use client';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { EllipsisSpinner } from '@/shared/ui/Spinners';

interface IProps {
  children: React.ReactNode;
  isLoading: boolean;
  hasMore: boolean;
  loadNext: (hasMore?: boolean) => void;
  threshold?: number;
  spinnerStyle?: string;
  isReversed?: boolean;
}

const ReactIntersectionObserver = ({
  isLoading,
  children,
  hasMore,
  loadNext,
  threshold = 0,
  spinnerStyle = 'relative top-0 left-0 flex w-full h-auto items-center justify-center',
  isReversed = false,
}: IProps) => {
  const [ref, inView] = useInView({ threshold: threshold });

  useEffect(() => {
    if (isLoading || !loadNext) return;

    if (inView) {
      loadNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <>
      {isReversed && hasMore && !isLoading && <div ref={ref} className="w-full h-4 opacity-0" />}
      {isReversed && isLoading && (
        <div className={spinnerStyle}>
          <EllipsisSpinner />
        </div>
      )}
      {children}
      {!isReversed && isLoading && (
        <div className={spinnerStyle}>
          <EllipsisSpinner />
        </div>
      )}
      {!isReversed && hasMore && !isLoading && <div ref={ref} className="w-full h-4 opacity-0" />}
    </>
  );
};

export default ReactIntersectionObserver;
