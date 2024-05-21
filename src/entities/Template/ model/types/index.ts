export interface ITemplate {
  id?: number;
  reference: string;
  desktop_url: string;
  tablet_url: string;
  mobile_url: string;
  background_url: string | null;
  name: string;
  created_at: string;
  profile_id: number;
  profile_reference: string;
  is_active: boolean;
}
