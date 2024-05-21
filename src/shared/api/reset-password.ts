import { axiosInstance } from '@/shared/api/axiosInstance';

export const sendCodeToResetPasswordHandler = async (email: string) => {
  const formData = new FormData();
  formData.append('email', email);
  const response = await axiosInstance.post('/v1/reset/password/code', formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data.data;
};

export const changePasswordHandler = async (email: string, code: string, new_password: string) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('code', code);
  formData.append('new_password', new_password);
  const response = await axiosInstance.post('/v1/reset/password', formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data.data;
};
