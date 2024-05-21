import { IPublicUser } from '@/entities/User';

export interface IClassicBody {
  id?: number;
  reference: string;
  text: string;
  image_url?: string | null;
  video_url?: string | null;
  with_default_reaction?: boolean;
}

interface ICustomizedBody {
  id?: number;
  reference: string;
  post_template_id?: string;
  post_template_reference?: string;
  desktop_url: string;
  tablet_url: string;
  mobile_url: string;
}

export interface UserReaction {
  id?: number;
  reference: string;
  structure_id: number;
  structure_reference: string;
  description: string;
  created_at: string;
}
export interface UserReactionStructure {
  id?: number;
  reference: string;
  icon_url: string;
  name: string;
  created_at: string;
  user_reaction: UserReaction | null;
  total_reactions: number;
}

export interface IPost {
  id?: number;
  reference: string;
  type: string;
  action_type?: string;
  created_at: string;
  user: IPublicUser;
  body: IClassicBody & ICustomizedBody;
  reactions: UserReactionStructure[];
  prev_post?: IPost;
  total_views: number;
  total_replies: number;
  total_reposts: number;
}

export interface postProps {
  post: IPost;
  withToken: boolean;
}

export interface IReply {
  id?: number;
  reference: string;
  action_type?: string;
  type: string;
  created_at: string;
  user: IPublicUser;
  body: IClassicBody & ICustomizedBody;
  prev_post: IReply;
  reactions: UserReactionStructure[];
  total_views: number;
  total_replies: number;
  total_reposts: number;
}
