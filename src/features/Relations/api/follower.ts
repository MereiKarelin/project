import { axiosInstance } from '@/shared/api/axiosInstance';

export const followToUserHandler = async (userId: number | string, accessToken: string) => {
  try {
    const response = await axiosInstance.post(`/v1/users/${userId}/followers`, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};
export const unFollowFromUserHandler = async (userId: number | string, accessToken: string) => {
  try {
    const response = await axiosInstance.delete(`/v1/users/${userId}/followers`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};
export const removeUserFromFollowersHandler = async (
  userId: number | string,
  accessToken: string,
) => {
  try {
    const response = await axiosInstance.delete(`/v1/users/me/followers/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};
export const getFollowersHandler = async (
  userId: number | string,
  offset = 0,
  limit = 10,
  dateCursorId: Date,
  accessToken: string,
) => {
  try {
    const body = {
      offset: offset,
      limit: limit,
      created_at: dateCursorId,
    };
    const response = await axiosInstance.get(`/v1/users/${userId}/followers`, {
      params: body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};
export const getFollowingHandler = async (
  userId: number | string,
  offset = 0,
  limit = 10,
  dateCursorId: Date,
  accessToken: string,
) => {
  try {
    const body = {
      offset: offset,
      limit: limit,
      created_at: dateCursorId,
    };
    const response = await axiosInstance.get(`/v1/users/${userId}/followings`, {
      params: body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};
