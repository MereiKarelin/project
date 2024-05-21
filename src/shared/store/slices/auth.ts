import { consoleLog, getCurrentTime } from '@/shared/utils';
import { createSlice } from '@reduxjs/toolkit';

export type AuthStatus = {
  isRefreshingTokens: boolean;
};

const initialState: AuthStatus = {
  isRefreshingTokens: false,
};

const slice = createSlice({
  name: 'tokenRefreshingStatus',
  initialState: initialState,
  reducers: {
    tokenRefreshingStarted: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      consoleLog('state.isRefreshingTokens = true;' + getCurrentTime());
      state.isRefreshingTokens = true;
    },
    tokenRefreshingStopped: (state) => {
      consoleLog('state.isRefreshingTokens = false;' + getCurrentTime());
      state.isRefreshingTokens = false;
    },
  },
});

export const { tokenRefreshingStarted, tokenRefreshingStopped } = slice.actions;

export default slice.reducer;
