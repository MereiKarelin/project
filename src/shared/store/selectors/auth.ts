import type { StoreState } from '@/shared/store';

export const tokenIsRefreshingSelector = (state: StoreState): boolean =>
  state.auth.isRefreshingTokens;
