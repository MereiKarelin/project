import { EditorType } from '@/_pages/Customizator/types';
import { screenType, UploadedFileTypes } from '@/shared/types';

export const defaultBGImage =
  'https://cdn.yourbandy.com/public/backgrounds/customize-bg-yourbandy.png';

export const allowedXtensions: Record<UploadedFileTypes, string> = {
  image: 'image/png, image/gif, image/jpeg, image/svg+xml',
  video: 'video',
  audio: 'audio',
  document: 'document',
} as const;

export const maxImageFileSize = 50 * 1024 * 1024; // in bytes

export const screenTypes: { [key in screenType]: screenType } = {
  desktop: 'desktop',
  tablet: 'tablet',
  mobile: 'mobile',
} as const;

export const viewportSizes: { [key in EditorType]: { width: number; height: number } } = {
  post: {
    width: 514,
    height: 400,
  },
  profile: {
    width: 465,
    height: 600,
  },
} as const;

export const safeDomains = ['youtube.com'];

export const defaultUserAvatar = 'https://cdn.yourbandy.com/public/images/default-user-avatar.png';
export const defaultReactionImage = 'https://cdn.yourbandy.com/public/icons/default-reaction.svg';
