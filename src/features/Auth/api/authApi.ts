import { axiosInstance, axiosInstanceForRefresh } from '@/shared/api/axiosInstance';
import { IObject } from '@daybrush/utils';

export const checkTokenAuth = (accessToken: string | undefined) => {
  if (!accessToken) return;
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return axiosInstanceForRefresh
      .post('/v1/token/check', {}, { headers: headers })
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        console.error(`checkTokenAuth failed: ${error}`);
      });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateRefreshToken = async (refreshToken: string | undefined) => {
  if (!refreshToken) return;

  const response = await axiosInstanceForRefresh.post('/v1/token/refresh', {
    refresh_token: refreshToken,
  });
  return response.data.data;
};

export const getUserInfoAuth = async (accessToken: string) => {
  try {
    const response = await axiosInstance.get('/v1/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getProfileAuth = async (userReference: number, accessToken: string) => {
  //TODO: why is this query being sent many times while loading feed page?
  try {
    const response = await axiosInstance.get(`/v1/users/${userReference}/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const loginUser = async (
  login: string,
  password: string,
  isRemember: boolean,
  header: IObject<string>,
) => {
  try {
    const scopesArray: string[] = await axiosInstance
      .get('/v1/auth/scopes')
      .then((data) => data.data.data);

    const ip = header['x-forwarded-for'] || 'n/a';
    const ua = header['user-agent'] || 'n/a';

    const scope = scopesArray.join(' ');
    const response = await axiosInstance.post(
      '/v1/login',
      { username: login, password: password, scope },
      {
        params: {
          is_remember: isRemember,
          ip_address: ip,
          user_agent: ua,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const signupUser = async (
  username: string,
  password: string,
  dateBirth: string,
  email: string,
  referralReference?: string,
) => {
  try {
    const body = {
      username: username,
      password: password,
      birth_date: dateBirth,
      email: email,
      referral_reference: referralReference || null,
    };
    const response = await axiosInstance.post('/v2/signup', body);
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const checkEmailAvailability = async (email: string) => {
  try {
    await axiosInstance.get('/v1/check-email', { params: { email: email } });
  } catch (err) {
    throw err;
  }
};

export const checkUsernameAvailability = async (username: string) => {
  try {
    await axiosInstance.get('/v1/check-username', {
      params: { username: username },
    });
  } catch (err) {
    throw err;
  }
};
