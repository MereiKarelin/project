import { IPrivateUser } from '@/entities/User';
import { getLocalUserData, storeUserInfo } from '@/shared/utils';
import { cleanLocalData, removeRefreshToken } from '@/shared/utils/auth';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: IPrivateUser = {
  reference: '',
  fullname: 'n/a',
  email: 'n/a',
  birth_date: new Date(0),
  created_at: new Date(0),
  phone_number: 'n/a',
  username: 'n/a',
  avatar: undefined,
  status: undefined,
};

const slice = createSlice({
  name: 'tokenRefreshingStatus',
  initialState: initialState,
  reducers: {
    login: (state: IPrivateUser, action: PayloadAction<{ user: IPrivateUser }>) => {
      const avatar = action.payload.user.avatar;
      const data = action.payload.user;

      //state = {...data} does not work for some reason
      state.reference = data.reference;
      state.fullname = data.fullname;
      state.email = data.email;
      state.birth_date = data.birth_date;
      state.created_at = data.created_at;
      state.phone_number = data.phone_number;
      state.username = data.username;
      state.avatar = avatar ? { ...avatar } : undefined;
      state.status = data.status;

      storeUserInfo(data);
    },

    updateUserData: (state: IPrivateUser, action: PayloadAction<{ data: IPrivateUser }>) => {
      const data = action.payload.data;
      const avatar = data.avatar;

      //state = {...data} does not work for some reason
      state.reference = data.reference;
      state.fullname = data.fullname;
      state.username = data.username;
      state.avatar = avatar ? { ...state.avatar, ...avatar } : undefined;
      state.status = data.status;

      storeUserInfo(data);
    },

    logout(state: IPrivateUser) {
      cleanLocalData();
      removeRefreshToken();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state = { ...initialState };
    },

    restoreUserData: (state: IPrivateUser) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      const data = getLocalUserData();

      if (data) {
        state.reference = data.reference;
        state.fullname = data.fullname;
        state.email = data.email;
        state.birth_date = data.birth_date;
        state.created_at = data.created_at;
        state.phone_number = data.phone_number;
        state.username = data.username;
        state.status = data.status;
        state.avatar = data.avatar ? { ...data.avatar } : undefined;
      }
    },
  },
});

export const { login, logout, restoreUserData, updateUserData } = slice.actions;

export default slice.reducer;
