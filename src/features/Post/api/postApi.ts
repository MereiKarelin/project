import { axiosInstance } from '@/shared/api/axiosInstance';

export const repostPostHandler = async (accessToken: string, body: any, postReference: string) => {
  try {
    const response = await axiosInstance.post(`/v1/posts/${postReference}/repost`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};
