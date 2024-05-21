import { axiosInstance } from '@/shared/api/axiosInstance';

export const UpdateUserAvatarHandler = async (data: FormData, accessToken: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    };
    const response = await axiosInstance.post('/v1/users/me/avatars', data, {
      headers: headers,
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};
