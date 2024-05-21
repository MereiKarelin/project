import { IReply } from '@/entities/Post/model/types';
import { Direction } from '@/shared/types';

export type ChildReply = { parent: IReply; reply: IReply };

export type SubMenuPosition = {
  offset: { [key in Direction]?: number };
  position: Direction;
};
