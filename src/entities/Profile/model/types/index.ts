import { ITemplate } from '@/entities/Template';
import { IPublicUser } from '@/entities/User';

export interface IProfile {
  user: IPublicUser;
  marital_status: string | null;
  gender: string | null;
  city: string | null;
  country: string | null;
  about_me: string | null;
  job_title: string | null;
  template: ITemplate | null;
  is_closed: boolean;
  followers_count: number | null;
  following_count: number | null;
  friends_count: number | null;
}
