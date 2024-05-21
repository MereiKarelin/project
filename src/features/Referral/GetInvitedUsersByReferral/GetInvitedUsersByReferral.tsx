import { useCallback, useState } from 'react';

import { IReferralUser } from '@/entities/Referral/types';
import { ReferralUserCard } from '@/entities/Referral/ui/ReferralUserCard';
import { useAuth } from '@/features/Auth/useAuth/useAuth';
import { getInvitedUsersByReferralHandler } from '@/features/Referral/api/referralApi';
import ReactIntersectionObserver from '@/shared/ui/ReactIntersectionObserver';

interface IProps {
  referralReference: string;
}

export const GetInvitedUsersByReferral = ({ referralReference }: IProps) => {
  const [usersList, setUsersList] = useState<IReferralUser[]>([]);
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
        void getInvitedUsersByReferralHandler(offset, limit, accessToken, referralReference)
          .then((res) => {
            setUsersList((prev) => [...prev, ...res.items]);
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
  }, [hasMore, isLoading, offset, referralReference, executeQueryCallback]);

  return (
    <div>
      <ReactIntersectionObserver hasMore={hasMore} isLoading={isLoading} loadNext={loadNext}>
        {usersList.length ? (
          <>
            {usersList.map((referralUser, index) => (
              <ReferralUserCard key={index} referralUser={referralUser} />
            ))}
          </>
        ) : !isLoading ? (
          <>
            <span className="font-semibold text-center flex">
              Отправке реферальную ссылку друзьям и получите вознаграждение от Yourbandy!
            </span>
          </>
        ) : null}
      </ReactIntersectionObserver>
    </div>
  );
};
