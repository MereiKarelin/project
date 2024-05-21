import { IClassicBody } from '@/entities/Post/model/types';
import { axiosInstance } from '@/shared/api/axiosInstance';

export const createClassicPostHandler = async (body: any, accessToken: string) => {
  let response;
  try {
    response = await axiosInstance.post('/v1/posts/classic', body, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getUserPostsHandler = async (
  userId: number | string,
  dateCursorId: Date,
  offset = 0,
  limit = 10,
  accessToken: string,
) => {
  try {
    const body = {
      offset: offset,
      limit: limit,
      created_at: dateCursorId,
      user_id: userId,
    };
    const headers = {
      ContentType: 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
    const response = await axiosInstance.get(`/v1/users/${userId}/posts`, {
      params: body,
      headers: headers,
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getPostsAuth = async (
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
    const headers = {
      ContentType: 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
    const response = await axiosInstance.get('/v1/posts', {
      params: body,
      headers: headers,
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getTrendingPostsHandler = async (
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
    const headers = {
      ContentType: 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
    const response = await axiosInstance.get('/v1/posts/trending', {
      params: body,
      headers: headers,
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getFeedPostsHandler = async (
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
    const response = await axiosInstance.get('/v1/feed/posts', {
      params: body,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const deletePostHandler = async (postId: number | string, accessToken: string) => {
  try {
    const response = await axiosInstance.delete(`/v1/posts/${postId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const createCustomizedPostHandler = async (
  desktop_file: string,
  tablet_file: string,
  mobile_file: string,
  accessToken: string,
  withDefaultReaction = true,
) => {
  try {
    const body = {
      desktop_file,
      tablet_file,
      mobile_file,
    };
    const response = await axiosInstance.post('/v1/posts/customized', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
      params: { with_default_reaction: withDefaultReaction },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getPostHandler = async (postId: number | string, accessToken: string) => {
  try {
    const response = await axiosInstance.get(`/v1/posts/${postId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getPostCommentsHandler = async (
  postId: number | string,
  dateCursorId: Date,
  offset = 0,
  limit = 10,
  accessToken = '',
) => {
  try {
    const body = {
      offset: offset,
      limit: limit,
      created_at: dateCursorId,
    };
    const response = await axiosInstance.get(`/v1/posts/${postId}/comments`, {
      params: body,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getCommentRepliesHandler = async (
  replyId: number | string,
  dateCursorId: Date,
  offset = 0,
  limit = 5,
  accessToken = '',
) => {
  try {
    const body = {
      offset: offset,
      limit: limit,
      created_at: dateCursorId,
    };
    const response = await axiosInstance.get(`/v1/replies/${replyId}/comments`, {
      params: body,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const createReactionStructureHandler = async (
  postId: number | string,
  body: FormData,
  accessToken: string,
) => {
  let response;
  try {
    response = await axiosInstance.post(
      `/v1/posts/${postId.toString()}/reaction-structures`,
      body,
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

export const assignReactionStructureToPostHandler = async (
  postId: number | string,
  body: FormData,
  accessToken: string,
) => {
  if (!postId) return;
  try {
    const response = await axiosInstance.post(`/v1/posts/${postId.toString()}/reactions`, body, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const removeReactionStructureFromPostHandler = async (
  postId: number | string,
  structure_reference: number | string,
  accessToken: string,
) => {
  let response;
  try {
    response = await axiosInstance.delete(
      `/v1/posts/${postId.toString()}/reactions?structure_reference=${structure_reference}`,
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

export const replyToPostHandler = async (
  postId: number | string,
  reply: IClassicBody,
  accessToken: string,
) => {
  try {
    const response = await axiosInstance.post(`/v1/posts/${postId.toString()}/reply`, reply, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const viewPostHandler = async (accessToken: string | undefined, postReference: string) => {
  try {
    await axiosInstance.post(`/v1/posts/${postReference}/views`, null, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (err) {
    throw err;
  }
};
