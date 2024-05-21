export const onWebsocketJoinCommand = (accessToken: string) => {
  return {
    command: 'JOIN',
    data: {
      token: accessToken,
    },
  };
};
export const onWebsocketLeaveCommand = (accessToken: string) => {
  return {
    command: 'LEAVE',
    data: {
      token: accessToken,
    },
  };
};
