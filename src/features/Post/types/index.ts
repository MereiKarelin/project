export type GetPostsHandler = (
  offset: number | undefined,
  limit: number | undefined,
  dateCursorId: Date,
  accessToken: string,
) => Promise<any>;
