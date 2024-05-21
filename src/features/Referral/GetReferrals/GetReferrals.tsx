'use client';
import { useCallback, useState } from 'react';

import { IReferral } from '@/entities/Referral/types';
import { ReferralCard } from '@/entities/Referral/ui/ReferralCard';
import { useAuth } from '@/features/Auth/useAuth/useAuth';
import { createReferralHandler, getReferralsHandler } from '@/features/Referral/api/referralApi';
import ReactIntersectionObserver from '@/shared/ui/ReactIntersectionObserver';

export const GetReferrals = () => {
  const [referralList, setReferralList] = useState<IReferral[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setLoading] = useState(false);

  const { executeQueryCallback } = useAuth();

  const loadNext = useCallback(() => {
    if (hasMore && !isLoading) {
      executeQueryCallback((accessToken: string) => {
        const limit = 10;

        setLoading(true);
        setOffset((prev) => prev + limit);
        void getReferralsHandler(offset, limit, accessToken)
          .then((res) => {
            setReferralList((prev) => [...prev, ...res.items]);
            setHasMore(res.items.length >= limit);
            setLoading(false);
          })
          .catch((e) => {
            console.log(e);
            setHasMore(false);
            setLoading(false);
          });
      });
    }
  }, [hasMore, isLoading, offset, executeQueryCallback]);

  const createReferral = useCallback(() => {
    executeQueryCallback((accessToken: string) => {
      void createReferralHandler(accessToken).then((res) => {
        setReferralList((prev) => [res, ...prev]);
      });
    });
  }, [executeQueryCallback]);

  return (
    <div className="mt-2 w-[514px] max-[960px]:w-full">
      <ReactIntersectionObserver hasMore={hasMore} isLoading={isLoading} loadNext={loadNext}>
        {referralList.length ? (
          <>
            {referralList.map((referral, index) => (
              <ReferralCard key={index} referral={referral} />
            ))}
          </>
        ) : !isLoading ? (
          <>
            <span className="text-2xl font-semibold">Нет рефералок</span>
            <div
              onClick={createReferral}
              className="w-auto bg-[#2DC96B] text-white p-2 pr-4 pl-4 rounded-full font-semibold cursor-pointer mt-5"
            >
              Создать рефералку
            </div>
          </>
        ) : null}
      </ReactIntersectionObserver>
    </div>
  );
};
