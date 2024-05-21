export interface IReferral {
  reference: string;
  user_reference: string;
  created_at: string;
}

export interface IReferralUser {
  reference: string;
  fullname: string | null;
  username: string;
  avatar_url: string | null;
  invited_at: string;
}
