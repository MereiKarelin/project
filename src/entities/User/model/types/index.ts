export interface IPrivateUser {
  reference: string;
  fullname: string;
  email: string;
  birth_date: Date;
  created_at: Date;
  phone_number: string;
  username: string;
  avatar?: {
    reference: string;
    small_url: string;
    large_url: string;
  };
  status?: {
    status: string;
    created_at: Date;
  };
}

export interface IPublicUser {
  reference: string;
  fullname: string;
  username: string;
  avatar?: {
    reference: string;
    small_url: string;
    large_url: string;
  };
  status?: {
    status: string;
    created_at: Date;
  };
}
