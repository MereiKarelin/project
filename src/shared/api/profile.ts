import { ProfilePayload } from '@/_pages/SettingsPage/types';
import { axiosInstance } from '@/shared/api/axiosInstance';

export const createProfileTemplateHandler = async (
  name: string,
  desktop_file: string,
  tablet_file: string,
  mobile_file: string,
  accessToken: string,
) => {
  try {
    const body = {
      name,
      desktop_file,
      tablet_file,
      mobile_file,
    };
    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axiosInstance.post('/v1/profiles/me/templates', body, {
      headers: headers,
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const updateProfileTemplateHandler = async (
  reference: string,
  desktop_file: string,
  tablet_file: string,
  mobile_file: string,
  accessToken: string,
) => {
  try {
    const body = {
      desktop_file,
      tablet_file,
      mobile_file,
    };
    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axiosInstance.put(`/v1/profiles/me/templates/${reference}`, body, {
      headers: headers,
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getProfileHandler = async (id: number | string) => {
  try {
    //TODO: called many times
    const response = await axiosInstance.get(`/v1/users/${id}/profile`);
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getProfileByUsernameHandler = async (
  username: string,
  controller?: AbortController,
) => {
  try {
    const response = await axiosInstance.get(`/v1/profiles/${username}`, {
      signal: controller?.signal,
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getProfileTemplatesHandler = async (dateCursorId: Date, accessToken: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axiosInstance.get('/v1/profiles/me/templates', {
      params: {
        created_at: dateCursorId,
      },
      headers: headers,
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const setProfileTemplateBackgroundHandler = async (
  reference: string,
  file: File,
  accessToken: string,
) => {
  try {
    const body = { file };
    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axiosInstance.post(
      `/v1/profiles/me/templates/${reference}/backgrounds`,
      body,
      {
        headers: headers,
      },
    );
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const updateProfileHandler = async (payload: ProfilePayload, accessToken: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axiosInstance.patch('/v1/profiles/me', payload, {
      headers: headers,
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getProfileTemplateHandler = async (reference: string, accessToken: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axiosInstance.get(`/v1/profiles/me/templates/${reference}`, {
      headers: headers,
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const updateProfileTemplateNameHandler = async (
  id: number | string,
  name: string,
  accessToken: string,
) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axiosInstance.patch(
      `/v1/profiles/me/templates/${id}`,
      { name },
      { headers: headers },
    );
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const deleteProfileTemplateHandler = async (id: number | string, accessToken: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axiosInstance.delete(`/v1/profiles/me/templates/${id}`, {
      headers: headers,
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const setActiveProfileTemplateHandler = async (id: number | string, accessToken: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axiosInstance.patch(`/v1/profiles/me/templates/${id}/activate`, null, {
      headers: headers,
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const setInactiveProfileTemplateHandler = async (
  id: number | string,
  accessToken: string,
) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axiosInstance.patch(`/v1/profiles/me/templates/${id}/deactivate`, null, {
      headers: headers,
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};
