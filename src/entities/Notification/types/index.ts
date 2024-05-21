export interface INotification {
  reference: string;
  target_user_reference: string;
  created_at: string;
  read_at: string | null;
  type: string;
  status?: string;
  body: Record<string, any>;
}
