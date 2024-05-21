'use client';

import React from 'react';

import { useFollowRelations } from '@/shared/hooks/';

import { FollowRelationsContext } from './FollowRelations';

export const FollowRelationsProvider = ({ children }: { children: React.ReactNode }) => {
  const followRelationHooks = useFollowRelations();

  return (
    <FollowRelationsContext.Provider value={followRelationHooks}>
      {children}
    </FollowRelationsContext.Provider>
  );
};
