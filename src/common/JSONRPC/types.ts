interface REQ_STRUCT {
  // 指定JSON-RPC协议版本的字符串，必须准确写为“2.0”
  jsonrpc: '2.0';
  // 包含所要调用方法名称的字符串，以rpc开头的方法名，
  // 用英文句号（U+002E or ASCII 46）连接的为预留给rpc内部的方法名及扩展名，且不能在其他地方使用。
  method: string;
  params: {
    data: any; // method调用执行的参数，调用方法所需要的结构化参数值，该成员参数可以被省略。
    rpc_req_id: number; // 本次调用请求的唯一标识
    rpc_timestamp: number; // 调用发生的时间戳
  };
  // 已建立客户端的唯一标识id，值必须包含一个字符串、数值或NULL空值。
  // 如果不包含该成员则被认定为是一个通知。该值一般不为NULL，若为数值则不应该包含小数。
  // 为避免重复，此值应使用基于时间戳、UUID或其他算法生成的唯一标识符。
  id?: number;
}

interface SUCCESS_RES_STRUCT {
  // 指定JSON-RPC协议版本的字符串，必须准确写为“2.0”
  jsonrpc: '2.0';
  // 该成员在成功时必须包含。
  result: {
    data: any; // method调用执行的结果
    rpc_req_id: number; // 本次调用请求的唯一标识，与请求时所携带的rpc_req_id一致，用于同一方法多次请求时的请求响应的时序对应
    rpc_timestamp: number; // 返回调用发生的时间戳
  };
  // 该成员必须包含。该成员值必须与请求对象中的id成员值一致。用于不同客户端的请求响应的对应
  // 响应对象必须包含result或error成员，但两个成员必须不能同时包含。
  id?: number;
}

interface ERROR_RES_STRUCT {
  // 指定JSON-RPC协议版本的字符串，必须准确写为“2.0”
  jsonrpc: '2.0';
  // 该成员在失败是必须包含。
  error: {
    code: number; // 使用数值表示该异常的错误类型。 必须为整数。
    message: string; // 对该错误的简单描述字符串。 该描述应尽量限定在简短的一句话。
    data: {
      rpc_req_id: number; // 本次调用请求的唯一标识，与请求时所携带的rpc_req_id一致，用于同一方法多次请求时的请求响应的时序对应
      rpc_timestamp: number; // 错误调用发生的时间戳
    };
  };
  // 该成员必须包含。该成员值必须与请求对象中的id成员值一致。用于不同客户端的请求响应的对应
  // 响应对象必须包含result或error成员，但两个成员必须不能同时包含。
  id?: number;
}

interface RPC_ERROR extends Error {
  code?: number;
  data?: any;
}

export { REQ_STRUCT, SUCCESS_RES_STRUCT, ERROR_RES_STRUCT, RPC_ERROR };