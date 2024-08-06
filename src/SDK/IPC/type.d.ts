type Handlers = {
  [key: string]: Function;
};

type Callbacks = {
  [key: string]: [Function, Function] | null;
};

type MethodSet = {
  [key: string]: Function | MethodSet;
};

type RegisterOptions = {
  repeater?: string;
};

type Target = string | number | Array<string | number>;

type RequestBody = {
  method: string;
  params: Object;
  target?: Target;
  req_id?: string;
  req_timestamp: number;
};
type ResponseBody = {
  jsonrpc: string;
  result?: any;
  error?: Object;
  req_id: string;
  req_timestamp: number;
  res_timestamp: number;
};

type ProtocolRequest = {
  jsonrpc: string;
  method: string;
  params: any;
  target: number | string;
  from: number | string;
  req_id: string;
  req_timestamp: number;
};

type ProtocolResponse = {
  jsonrpc: string;
  result: any;
  error: any;
  target: number | string;
  from: number | string;
  req_id: string;
  req_timestamp: number;
  res_timestamp: number;
};
