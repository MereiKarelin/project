import { IObject } from '@daybrush/utils';

export type LinkData = {
  linkStyle?: IObject<string>;
  caption: {
    text: string | undefined;
    style?: IObject<string>;
  };
  isIconEnabled: boolean;
  url: string;
};
