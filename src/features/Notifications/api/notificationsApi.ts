import { axiosInstance } from '@/shared/api/axiosInstance';
import { getStoredAccessToken } from '@/shared/utils';

export const getNotificationsHandler = async (
  offset = 0,
  limit = 10,
  dateCursorId: Date,
  accessToken: string,
) => {
  try {
    const params = {
      offset: offset,
      limit: limit,
      created_at: dateCursorId,
    };
    const response = await axiosInstance.get('/v1/notifications', {
      params: params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getNotificationsCountsHandler = async (accessToken: string | undefined) => {
  if (!accessToken) return;
  try {
    const response = await axiosInstance.get('/v1/notifications/counts', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const readNotificationsAuth = async (accessToken: string) => {
  try {
    const response = await axiosInstance.post('/v1/notifications', null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const readConcreteNotificationsHandler = async (notificationReference: string) => {
  try {
    const authToken = getStoredAccessToken();
    const response = await axiosInstance.put(`/v1/notifications/${notificationReference}`, null, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};
