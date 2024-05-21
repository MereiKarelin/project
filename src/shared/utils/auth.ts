import Cookies from 'js-cookie';

import { AUTH_ITEMS } from '@/shared/consts/backendExcCodes';

export const cleanLocalData = () => localStorage.clear();

export const removeRefreshToken = () => Cookies.remove(AUTH_ITEMS.REFRESH_TOKEN);
