export const EVENT = {
  M2R_QUESTION: '__M2R_QUESTION__',
  M2R_ANSWER: '__M2R_ANSWER__',
  R2M_MESSAGE: '__R2M_MESSAGE__',
  R2R_REGISTER: '__R2R_REGISTER__',
  R2R_UNREGISTER: '__R2R_UNREGISTER__',
  R2R_INIT_BRIDGE: '__R2R_INIT_BRIDGE__',
  R2R_SET_WINDOW_WEBCONTENTS_ID: '__R2R_SET_WINDOW_WEBCONTENTS_ID__',
  R2R_QUESTION: '__R2R_QUESTION__',
  R2R_ANSWER: '__R2R_ANSWER__',
};

export const R2R_REPEATER_TYPE = {
  IPC: '__IPC_REPEATER__',
  MP: '__MESSAGE_PORT_REPEATER__',
};

export const ERROR = {
  // PARSE_ERROR 调用过程不使用JSON序列化与反序列化，不需要
  PARSE_ERROR: { code: -32700, message: 'Parse error', data: null },
  // INVALID_REQUEST 方法名非法、调用目标参数不存在
  INVALID_REQUEST: { code: -32600, message: 'Invalid Request', data: null },
  // METHOD_NOT_FOUND 方法未注册时调用返回
  METHOD_NOT_FOUND: { code: -32601, message: 'Method not found', data: null },
  // INVALID_PARAMS 交由注册者处理
  INVALID_PARAMS: { code: -32602, message: 'Invalid params', data: null },
  // INTERNAL_ERROR Worker进程内部？
  INTERNAL_ERROR: { code: -32603, message: 'Internal error', data: null },
  // -32000 to -32099, 预留用于自定义的服务器错误。
  // try catch 块的 catch 调用
  SERVER_ERROR: { code: -32000, message: 'Server error', data: null },
  TARGET_NOT_FOUND: { code: -32001, message: 'Server error', data: 'Target window not found.' },
};
export const R2R_MAIN_WORLD_NAME = '__R2R_IPC__';
export const R2M_MAIN_WORLD_NAME = '__R2M_IPC__';
export const M2R_MAIN_WORLD_NAME = '__M2R_IPC__';
