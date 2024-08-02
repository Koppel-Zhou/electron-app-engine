export const EVENT = {
  R2M_MESSAGE: '__R2M_MESSAGE__',
  R2R_REGISTER: '__R2R_REGISTER__',
  R2R_INIT_BRIDGE: '__R2R_INIT_BRIDGE__',
  R2R_SET_WINDOW_NAME: '__R2R_SET_WINDOW_NAME__',
  R2R_QUESTION: '__R2R_QUESTION__',
  R2R_ANSWER: '__R2R_ANSWER__',
};

export const R2R_REPEATER_TYPE = {
  IPC: '__IPC__',
  MP: '__MESSAGE_PORT__',
};

export const ERROR = {
  // PARSE_ERROR 调用过程不使用JSON序列化与反序列化，不需要
  PARSE_ERROR: { code: -32700, message: 'Parse error', data: null },
  // INVALID_REQUEST 当注册方法与内部方法同名时？
  INVALID_REQUEST: { code: -32600, message: 'Invalid Request', data: null },
  // METHOD_NOT_FOUND 方法论未注册时调用返回
  METHOD_NOT_FOUND: { code: -32601, message: 'Method not found', data: null },
  // INVALID_PARAMS 交由注册者处理
  INVALID_PARAMS: { code: -32602, message: 'Invalid params', data: null },
  // INTERNAL_ERROR Worker进程内部？
  INTERNAL_ERROR: { code: -32603, message: 'Internal error', data: null },
  // -32000 to -32099, 预留用于自定义的服务器错误。
  // try catch 块的 catch 调用
  SERVER_ERROR: { code: -32000, message: 'Server error', data: null },
};
export const R2R_MAIN_WORLD_NAME = 'IPC_R2R';
export const R2M_MAIN_WORLD_NAME = 'IPC_R2M';
