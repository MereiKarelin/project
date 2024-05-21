import { axiosInstance } from '@/shared/api/axiosInstance';
import { getStoredAccessToken } from '@/shared/utils';

export const getDirectChatsHandler = async (
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
    const response = await axiosInstance.get('/v1/private-chats', {
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

export const getDirectMessagesHandler = async (
  chatReference: string,
  offset = 0,
  limit = 10,
  dateCursorId: Date,
  orderBy: string,
  accessToken: string,
) => {
  try {
    const params = {
      offset: offset,
      limit: limit,
      created_at: dateCursorId,
      order_by: orderBy,
    };
    const response = await axiosInstance.get(`/v1/private-chats/${chatReference}/messages`, {
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

export const sendMessageHandler = async (
  chatReference: string,
  text: string,
  images: any,
  reference: string,
) => {
  try {
    const body = {
      text: text,
      images: images,
      reference: reference,
    };
    const authToken = getStoredAccessToken();
    const response = await axiosInstance.post(`/v1/private-chats/${chatReference}/messages`, body, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const createDirectChatHandler = async (targetUserReference: string, accessToken: string) => {
  try {
    const response = await axiosInstance.post(`/v1/users/${targetUserReference}/chats`, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getDirectChatByReferenceHandler = async (
  chatReference: string,
  accessToken: string,
) => {
  try {
    const response = await axiosInstance.get(`/v1/private-chats/${chatReference}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const readAllMessagesInDirectChatHandler = async (
  chatReference: string,
  accessToken: string,
) => {
  try {
    const response = await axiosInstance.post(
      `/v1/private-chats/${chatReference}/messages/read`,
      null,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getDirectChatBetweenUsersHandler = async (
  targetUserReference: string,
  accessToken: string,
) => {
  try {
    const response = await axiosInstance.get(`/v1/users/${targetUserReference}/chats`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};
