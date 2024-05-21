import { axiosInstance } from '@/shared/api/axiosInstance';

export const getCustomizationProfilesHandler = async (
  offset: number,
  limit: number,
  cursorId: Date,
  accessToken: string | undefined,
) => {
  try {
    let headers = {};
    if (accessToken) {
      headers = {
        Authorization: `Bearer ${accessToken}`,
      };
    }
    const response = await axiosInstance.get('/v1/profiles', {
      headers: headers,
      params: {
        offset: offset,
        limit: limit,
        cursor_id: cursorId,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};
