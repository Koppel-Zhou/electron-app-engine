import { ERROR_STRUCT } from './types';

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
