import { Dispatch, SetStateAction, useState } from 'react';

import { GlobalFollowRelations } from '@/shared/types';

export const useFollowRelations = (): [
  GlobalFollowRelations,
  Dispatch<SetStateAction<GlobalFollowRelations>>,
] => {
  const [globalFollowRelations, setGlobalFollowRelations] = useState<GlobalFollowRelations>({});

  return [globalFollowRelations, setGlobalFollowRelations];
};
