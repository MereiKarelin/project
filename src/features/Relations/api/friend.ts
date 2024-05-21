import { axiosInstance } from '@/shared/api/axiosInstance';

export const removeUserFromFriendsHandler = async (
  userId: number | string,
  accessToken: string,
) => {
  try {
    const response = await axiosInstance.delete(`/v1/users/${userId}/friends`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getFriendsHandler = async (
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
    const response = await axiosInstance.get(`/v1/users/${userId}/friends`, {
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
