export type UploadedFileTypes = 'image' | 'video' | 'document' | 'audio';
export type UploadedFile = {
  file?: File;
  src: string;
  type: UploadedFileTypes;
};

export type UploadedReaction = Omit<UploadedFile, 'type'> & {
  name: string;
};

export type GlobalFollowRelations = {
  [id: string]: {
    isFollower: boolean;
    isFollowing: boolean;
    isFriend: boolean;
  };
};

export type screenType = 'tablet' | 'mobile' | 'desktop';

export type Direction =
  | 'left'
  | 'top'
  | 'right'
  | 'bottom'
  | 'horizontalCenter'
  | 'verticalCenter'
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight';

export type JSXObject = {
  markup: JSX.Element;
  list: {
    [key: string]: JSX.Element;
  };
};

export type Position = { x: number; y: number };
export type ImageSize = { w: number; h: number };
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
