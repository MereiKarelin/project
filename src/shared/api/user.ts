import { axiosInstance } from '@/shared/api/axiosInstance';

export const updateUserBirthDate = async (body: any, accessToken: string) => {
  let response;
  try {
    response = await axiosInstance.patch('/v1/users/me/birth-date', body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const updateUsernameHandler = async (newUsername: string, accessToken: string) => {
  const formData = new FormData();
  formData.append('username', newUsername);
  let response;
  try {
    response = await axiosInstance.patch('/v1/users/me/username', formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const updateFullnameHandler = async (newFullname: string, accessToken: string) => {
  const formData = new FormData();
  formData.append('fullname', newFullname);
  let response;
  try {
    response = await axiosInstance.patch('/v1/users/me/fullname', formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getUserMeInfo = async (accessToken: string) => {
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

export const getUserByReference = async (reference: string, accessToken: string) => {
  try {
    const response = await axiosInstance.get(`/v2/users/${reference}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};
