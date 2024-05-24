const PARSE_ERROR = {
  code: -32700,
  message: '语法解析错误',
};

const INVALID_REQUEST = {
  code: -32600,
  message: '无效的请求',
};

const METHOD_NOT_FOUND = {
  code: -32601,
  message: '方法未找到',
};

const INVALID_PARAMS = {
  code: -32602,
  message: '无效的参数',
};

const INTERNAL_ERROR = {
  code: -32603,
  message: '内部错误',
};

export {
  PARSE_ERROR,
  INVALID_REQUEST,
  METHOD_NOT_FOUND,
  INVALID_PARAMS,
  INTERNAL_ERROR,
};
