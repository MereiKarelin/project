import { useContext } from 'react';

import { FollowRelationsContext } from '../../context/FollowRelations';

export const useFollowRelationContext = () => {
  return useContext(FollowRelationsContext);
};
