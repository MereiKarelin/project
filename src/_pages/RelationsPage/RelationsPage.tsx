'use client';

import { useEffect, useState } from 'react';

import { Relations } from '@/features/Relations/ui/Relations';
import { getProfileByUsernameHandler } from '@/shared/api/profile';
import { RequireAuth } from '@/shared/components';
import { useAppSelector } from '@/shared/store/hooks';
import { userSelector } from '@/shared/store/selectors/user';
import { logBackendError } from '@/shared/utils/error';
import { IObject } from '@daybrush/utils';

type PropTypes = {
  username: string;
  header: IObject<string>;
};

const RelationsPage = ({ username, header }: PropTypes) => {
  const user = useAppSelector(userSelector);
  const [userReference, setUserReference] = useState<string>();

  useEffect(() => {
    if (!username) return;
    if (user?.username === username) {
      setUserReference(user.reference);
    } else {
      getProfileByUsernameHandler(username)
        .then((profile) => {
          setUserReference(profile.user.reference);
        })
        .catch((error) => {
          logBackendError(error, 'getProfileByUsernameHandler failed');
        });
    }
  }, [username, user]);

  if (userReference === undefined) return null;

  return (
    <RequireAuth>
      <Relations header={header} userId={userReference} />
    </RequireAuth>
  );
};

export default RelationsPage;
