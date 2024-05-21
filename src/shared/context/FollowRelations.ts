'use client';
import { createContext, Dispatch, SetStateAction } from 'react';

import { GlobalFollowRelations } from '@/shared/types';

export const FollowRelationsContext = createContext<
  [GlobalFollowRelations, Dispatch<SetStateAction<GlobalFollowRelations>>]
>([{}, () => {}]);
