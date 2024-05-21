import { axiosInstance } from '@/shared/api/axiosInstance';

export const getReferralsHandler = async (offset: number, limit: number, accessToken: string) => {
  try {
    const response = await axiosInstance.get('/v1/referrals', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        offset,
        limit,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const getInvitedUsersByReferralHandler = async (
  offset: number,
  limit: number,
  accessToken: string,
  referralReference: string,
) => {
  try {
    const response = await axiosInstance.get(`/v1/referrals/${referralReference}/invited-users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        offset,
        limit,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};

export const createReferralHandler = async (accessToken: string) => {
  try {
    const response = await axiosInstance.post('/v1/referrals', null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err;
  }
};
