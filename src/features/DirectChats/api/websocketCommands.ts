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
export const onWebsocketWritingStatus = (accessToken: string) => {
  return {
    status: 'WRITING',
    data: {
      token: accessToken,
    },
  };
};
export const onWebsocketStopActionStatus = (accessToken: string) => {
  return {
    status: 'STOP_ACTION',
    data: {
      token: accessToken,
    },
  };
};
