import { axiosInstance } from '@/shared/api/axiosInstance';

export const uploadImageHandler = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axiosInstance.post('/v1/images', formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const uploadVideoHandler = async (formData: FormData, accessToken: string) => {
  try {
    const response = await axiosInstance.post('/v1/videos', formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};
