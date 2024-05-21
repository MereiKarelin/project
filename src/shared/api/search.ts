import { axiosInstance } from '@/shared/api/axiosInstance';

export const searchChatUsersHandler = async (value: string, accessToken: string) => {
  try {
    const params = {
      query: value,
      offset: 0,
      limit: 100,
    };
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axiosInstance.get('/v1/search/users', {
      params: params,
      headers: headers,
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};
