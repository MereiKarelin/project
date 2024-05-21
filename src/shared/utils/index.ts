import axios from 'axios';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

import { DATA_SCENA_ELEMENT_ID } from '@/_pages/Customizator/consts';
import { IProfile } from '@/entities/Profile';
import { IPrivateUser } from '@/entities/User';
import { defaultBGImage, safeDomains, screenTypes } from '@/shared/consts';
import { AUTH_ITEMS, LOCALSTORAGE_ITEMS } from '@/shared/consts/backendExcCodes';
import { Direction } from '@/shared/types';
import { removeRefreshToken } from '@/shared/utils/auth';
import { IObject } from '@daybrush/utils';

export const lockBackground = (locked: boolean) => {
  const bodyElement = document.getElementsByTagName('body')[0];
  bodyElement.style.overflowY = locked ? 'hidden' : 'scroll';
};

export const isScrollAtTop = (element: HTMLDivElement, threshold: number) =>
  element.scrollTop < threshold;
export const isScrollAtBottom = (element: HTMLDivElement, threshold: number) =>
  Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < threshold;

export const getId = (object: { id?: number; reference: string } | undefined | null) => {
  if (object?.reference) {
    return object.reference;
  }
  return object?.id ?? -1;
};

export const getUserId = (
  object: { user_id?: number; user_reference: string } | undefined | null,
) => {
  if (object?.user_reference) {
    return object.user_reference;
  }
  return object?.user_id ?? -1;
};

export const getStringId = (object: { id: string; reference: string }) => {
  if (object?.reference) {
    return object.reference;
  }

  return object.id;
};

export const extractTemplateHTML = async (link: string) => {
  const page = await axios.get(link);
  return page.data;
};

export const changeBackground = (imageUrl: string | null) => {
  const tag = document.getElementsByTagName('body')?.[0];
  tag.style.backgroundImage = `url(${imageUrl ?? defaultBGImage})`;
};

/**
 *
 * @param obj : key value pairs
 * @param removedKey : key of entry to be filtered out
 * @returns new object without entry with given key
 */
export const removeObjectEntryByKey = (obj: { [key: string]: any }, removedKey: string) =>
  Object.keys(obj)
    .filter((key) => key !== removedKey)
    .reduce((raw: { [key: string]: any }, key: string) => {
      raw[key] = obj[key];
      return raw;
    }, {});

export const replaceObjectEntry = (
  obj: { [key: string]: any },
  oldKey: string,
  newKey: string,
  newValue: any,
) => {
  if (!newKey) return obj;
  const updatedObject = removeObjectEntryByKey(obj, oldKey);
  return { ...updatedObject, [newKey]: newValue };
};

export const toCamelCase = (str: string, separator = '-') => {
  if (str.split(separator).length == 1) return str;

  return str.split(separator).reduce((result, word, index) => {
    if (index === 0) {
      return word.toLowerCase();
    }
    return result + word[0].toUpperCase() + word.slice(1).toLowerCase();
  }, '');
};

export const getScreenType = (screenWidth: number) => {
  if (screenWidth >= 1024) return screenTypes.desktop;
  if (screenWidth >= 768) return screenTypes.tablet;
  return screenTypes.mobile;
};

export const getSubMenuPosition = (
  boundingClientRect: DOMRect,
  submenuWidth: number,
  offset: { [key in Direction]?: number } = {},
): { position: Direction; offset: { [key in Direction]?: number } } => {
  const left = boundingClientRect.left - 20;
  const right = boundingClientRect.right - 20;
  const width = window.innerWidth - 40;

  const availableWidthFromRight = width - (left + right) / 2;
  const availableWidthFromLeft = (left + right) / 2;

  if (availableWidthFromLeft < submenuWidth && availableWidthFromRight < submenuWidth) {
    //display menu at center of window
    return {
      position: 'horizontalCenter',
      offset: { ...(offset ?? {}), left: width / 2 - submenuWidth / 2 },
    };
  } else if (availableWidthFromRight > submenuWidth) {
    //display menu to the right of item
    return { position: 'right', offset: { ...offset, left: availableWidthFromLeft } };
  }

  return { position: 'left', offset: { ...offset, right: availableWidthFromRight } };
};

export const getLocalUserData = () => {
  if (!window) return undefined;

  const json = window.localStorage.getItem(LOCALSTORAGE_ITEMS.USER_DATA);
  const userData: IPrivateUser | undefined = json ? JSON.parse(json) : undefined;

  if (!userData) {
    console.error('user not defined in storage');
  }

  return userData;
};

export const getCurrentProfile = () => {
  if (!window) return null;

  const profile = window.localStorage.getItem(LOCALSTORAGE_ITEMS.USER_PROFILE);
  const userProfile: IProfile | null = profile ? JSON.parse(profile) : null;

  if (!userProfile) {
    console.error('user profile not defined in storage');
  }

  return userProfile;
};

export const getLastArrayElement = (arr: any[] | undefined) => {
  if (!arr || arr.length === 0) return undefined;

  return arr[arr.length - 1];
};

export const isUrlValid = (url: string | undefined) => {
  if (!url) return false;

  const isAllowedProtocol = (str: string) => {
    return (
      str === 'http://' ||
      str === 'https://' ||
      str === 'http://www' ||
      str === 'https://www' ||
      str === 'www'
    );
  };

  const isAllowedProtocolNoSlashes = (str: string) => {
    return str === 'http' || str === 'https' || str === 'www';
  };

  const isStartsWithAllowedProtocol = (str: string) => {
    return (
      str.startsWith('http://') ||
      str.startsWith('https://') ||
      str.startsWith('http://www.') ||
      str.startsWith('https://www.') ||
      str.startsWith('www.')
    );
  };

  const parts = url.split('.');
  if (parts.length === 1) {
    return false;
  }

  const part1 = parts[0];
  const part2 = parts[1];
  const part3 = parts[2];
  const part4 = parts[2];

  if (parts.length === 2) {
    const matches1 = part1.match(/[a-zA-Z0-9-]+/g);
    const matches2 = part2.match(/[a-zA-Z0-9-]+/g);

    if (!matches1 || !matches2) return false;

    let res1 = !isAllowedProtocol(part1);
    if (res1 && matches1.length > 1) {
      res1 = isAllowedProtocolNoSlashes(matches1[0]) && isStartsWithAllowedProtocol(part1);
    }
    return res1;
  }

  if (parts.length === 3) {
    const res1 = isStartsWithAllowedProtocol(part1) || part1.match(/[a-zA-Z0-9-]+/g)?.length === 1;

    const res2 = part2.match(/[a-zA-Z0-9-]+/g) !== null && part2 !== 'www';
    const res3 = part3.match(/[a-zA-Z0-9-]+/g) !== null;

    return res1 && res2 && res3;
  }

  if (parts.length === 4) {
    const res1 = isStartsWithAllowedProtocol(part1) || part1.match(/[a-zA-Z0-9-]+/g)?.length === 1;

    const res2 = part2.match(/[a-zA-Z0-9-]+/g) !== null && part2 !== 'www';
    const res3 = part3.match(/[a-zA-Z0-9-]+/g) !== null;
    const res4 = part4.match(/[a-zA-Z0-9-]+/g) !== null;

    return res1 && res2 && res3 && res4;
  }

  return false;
};

export const getEditorTarget = (id: string | undefined) => {
  if (!id) return;
  return document.querySelector<HTMLElement>(`[${DATA_SCENA_ELEMENT_ID}="${id}"]`);
};

export const removeProtocolFromUrl = (url: string) => {
  if (url.startsWith('http://www.')) {
    return url.replace('http://www.', '');
  } else if (url.startsWith('https://www.')) {
    return url.replace('https://www.', '');
  } else if (url.startsWith('http://')) {
    return url.replace('http://', '');
  } else if (url.startsWith('https://')) {
    return url.replace('https://', '');
  } else if (url.startsWith('www.')) {
    return url.replace('www.', '');
  }
  return url;
};

export const isYourbandyUrl = (url: string | undefined) => {
  if (!url) return false;
  const urlNoProtocol = removeProtocolFromUrl(url);

  if (urlNoProtocol.startsWith('test.yourbandy.com')) {
    return true;
  }

  return urlNoProtocol.startsWith('yourbandy.com');
};

export const isSafeUrl = (url: string | undefined) => {
  if (!url) return false;
  if (isYourbandyUrl(url)) return true;

  const urlNoProtocol = removeProtocolFromUrl(url);

  for (const safeDomainName of safeDomains) {
    if (urlNoProtocol.startsWith(safeDomainName)) return true;
  }

  return false;
};

const removeTrailingZero = (str: string) => {
  if (str.endsWith('.0')) {
    return str.slice(0, -2);
  }
  return str;
};

export const getShortCounterString = (count: number, isDisplayZero = false) => {
  if (count === 0) {
    return isDisplayZero ? '0' : '';
  } else if (count < 1000) {
    return count.toString();
  } else if (count >= 1000 && count < 10000) {
    const short = removeTrailingZero((count / 1000).toFixed(1));
    return `${short}k`;
  } else if (count >= 10000 && count < 1000000) {
    const short = removeTrailingZero(Math.ceil(count / 1000).toString());
    return `${short}k`;
  } else {
    const short = removeTrailingZero(Math.ceil(count / 1000000).toString());
    return `${short}M`;
  }
};

export const storeAccessToken = (accessToken: string) => {
  if (!window) return false;
  if (!accessToken) {
    window.localStorage.removeItem(AUTH_ITEMS.ACCESS_TOKEN);
    return false;
  }
  window.localStorage.setItem(AUTH_ITEMS.ACCESS_TOKEN, accessToken);
  return true;
};

export const getStoredAccessToken = () => {
  if (!window) return;
  return window.localStorage.getItem(AUTH_ITEMS.ACCESS_TOKEN);
};

export const storeUserInfo = (userInfo: IPrivateUser | null) => {
  if (!window) return false;
  if (!userInfo) {
    window.localStorage.removeItem(LOCALSTORAGE_ITEMS.USER_DATA);
    return true;
  }

  window.localStorage.setItem(LOCALSTORAGE_ITEMS.USER_DATA, JSON.stringify(userInfo));
  return true;
};

export const storeProfileInfo = (profileInfo: IObject<string> | null) => {
  if (!window) return false;
  if (!profileInfo) {
    window.localStorage.removeItem(LOCALSTORAGE_ITEMS.USER_PROFILE);
    return true;
  }
  window.localStorage.setItem(LOCALSTORAGE_ITEMS.USER_PROFILE, JSON.stringify(profileInfo));
  return true;
};

export const getRefreshToken = () => {
  return Cookies.get(AUTH_ITEMS.REFRESH_TOKEN);
};

export const storeRefreshToken = (token: string, options?: IObject<any>) => {
  if (!token) {
    removeRefreshToken();

    return false;
  }
  Cookies.set(AUTH_ITEMS.REFRESH_TOKEN, token, options);
  return true;
};

export const tokenExpiryDate = (tokenString: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const token = jwtDecode(tokenString) as IObject<any>;
  if (!token.exp) return;

  const expiry = token.exp;
  return expiry * 1000;
};

export const isTokenExpired = (tokenString: string) => {
  if (!tokenString) return true;
  const expiryDate = tokenExpiryDate(tokenString);
  if (!expiryDate) return true;

  const maxDate = Date.now() + 10000;
  return maxDate > expiryDate;
};

export const getCurrentTime = () => {
  const date = new Date();

  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  const ms = date.getMilliseconds().toString().padStart(3, '0');

  return `${h}:${m}:${s}.${ms}`;
};

export const consoleLog = (val: any) => {
  if (process.env.NODE_ENV !== 'development') return;
  if (typeof val === 'object') {
    console.log(`Printing object below ${getCurrentTime()}`);
    console.log(val);
    return;
  }
  console.log(`${val} : ${getCurrentTime()}`);
};
