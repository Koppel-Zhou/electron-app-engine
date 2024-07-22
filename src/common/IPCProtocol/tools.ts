type ERROR_STRUCT = {
  code: number; // 使用数值表示该异常的错误类型。 必须为整数。
  message: string; // 对该错误的简单描述字符串。 该描述应尽量限定在简短的一句话。
  data?: any;
};

class IPCResponse {
  result: any;

  timestamp: number;

  constructor(result: any) {
    this.result = result;
    this.timestamp = Date.now();
  }

  toString() {
    return JSON.stringify({
      result: this.result,
      timestamp: this.timestamp,
    });
  }
}

class IPCError {
  error: any;

  timestamp: any;

  constructor(error: ERROR_STRUCT) {
    this.error = error;
    this.timestamp = Date.now();
  }

  toString() {
    return JSON.stringify({
      error: this.error,
      timestamp: this.timestamp,
    });
  }
}

export { IPCResponse, IPCError };
