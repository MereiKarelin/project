import { Fragment, useCallback, useState } from 'react';

import { IProfile } from '@/entities/Profile';
import { ProfileCard } from '@/entities/Profile/ui/ProfileCard';
import { useAuth } from '@/features/Auth/useAuth/useAuth';
import { getCustomizationProfilesHandler } from '@/features/Profile/api/profileApi';
import ReactIntersectionObserver from '@/shared/ui/ReactIntersectionObserver';

export const GetCustomizationProfiles = () => {
  const [profileList, setProfileList] = useState<IProfile[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const { executeQueryCallback } = useAuth();

  const loadNext = useCallback(() => {
    const dateCursorId = new Date();
    const limit = 10;
    if (hasMore && !isLoading) {
      executeQueryCallback((accessToken: string) => {
        setLoading(true);
        setOffset((prev) => prev + limit);
        void getCustomizationProfilesHandler(offset, limit, dateCursorId, accessToken)
          .then((res) => {
            setProfileList((prev) => [...prev, ...res.items]);
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

  return (
    <>
      <div className="grid justify-center">
        <ReactIntersectionObserver hasMore={hasMore} isLoading={isLoading} loadNext={loadNext}>
          {profileList.length ? (
            <>
              {profileList.map((profile, index) => (
                <Fragment key={index}>
                  {(index + 1) % 5 === 0 ? (
                    // TODO Добавить рекламный блок
                    <></>
                  ) : (
                    <ProfileCard profile={profile} />
                  )}
                </Fragment>
              ))}
            </>
          ) : !isLoading ? (
            <span className="text-2xl font-semibold">
              Профилей нет, пригласите или найдите друзей!
            </span>
          ) : null}
        </ReactIntersectionObserver>
      </div>
    </>
  );
};
