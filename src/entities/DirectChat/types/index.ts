export interface IDirectChatUser {
  reference: string;
  username: string;
  fullname: string | null;
  avatar_url: string | null;
  is_online_in_chat: boolean;
}

export interface IDirectChat {
  first_user: IDirectChatUser;
  second_user: IDirectChatUser;
  reference: string;
  created_at: string;
  last_message: ILastMessage | null;
  unread_messages_count: number;
}

export interface ILastMessage {
  text: string | null;
  created_at: string;
  user_reference: string;
  images: string[] | null;
}

export interface IDirectMessage {
  reference: string;
  chat_reference?: string;
  user_reference: string;
  text: string | null;
  edited_at: string | null;
  read_at: string | null;
  created_at: string;
  images: string[] | null;
  isSending?: boolean;
}
