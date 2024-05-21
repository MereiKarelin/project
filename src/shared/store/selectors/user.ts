import { IPrivateUser } from '@/entities/User';

export const userSelector = (state: { user: IPrivateUser }): IPrivateUser => state.user;
