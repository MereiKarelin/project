export enum BACKEND_EXC_CODES {
  UserNotFoundByUsernameError = 'UserNotFoundByUsernameError',
  InvalidLoginOrPasswordError = 'InvalidLoginOrPasswordError',
  UserNotFoundByEmailError = 'UserNotFoundByEmailError',
  CodeAlreadySentError = 'CodeAlreadySentError',
}

//TODO: refactor, enum to const and move consts to index.ts
export enum LOCALSTORAGE_ITEMS {
  USER_DATA = 'user_data',
  USER_PROFILE = 'user_profile',
}

export enum AUTH_ITEMS {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}
