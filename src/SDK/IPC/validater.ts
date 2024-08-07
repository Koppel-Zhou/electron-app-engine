import { ERROR } from './dictionary';

// 正则表达式：匹配合法的变量名
const validNamePattern = /^[a-zA-Z_$][a-zA-Z0-9_.$]*$/;
const reserved = ['$'];

export const isValidName = (name: string) => validNamePattern.test(name);

export const registerValidater = (methods: Handlers, handlers: Handlers) => {
  Object.keys(methods).forEach((method) => {
    if (handlers[method]) {
      console.error(`Method name "${method}" has been registered, ignored.`);
    } else if (reserved.includes(method)) {
      console.error(`Method name "${method}" is reserved, ignored.`);
    } else if (isValidName(method)) {
      handlers[method] = methods[method];
    } else {
      console.error(`Method name "${method}" is invalid, ignored.`);
    }
  });
};
export const callValidater = async (
  requestBody: RequestBody,
  handlers: Handlers,
) => {
  const { method, params, req_id, req_timestamp } = requestBody;
  const response: ResponseBody = {
    jsonrpc: '2.0',
    req_id,
    req_timestamp,
  };
  if (!handlers[method]) {
    response.error = ERROR.METHOD_NOT_FOUND;
    response.res_timestamp = Date.now();
    return response;
  }
  let result;
  try {
    result = await handlers[method](params);
    response.result = result;
    response.res_timestamp = Date.now();
  } catch (error) {
    response.error = { ...ERROR.SERVER_ERROR, data: error };
    response.res_timestamp = Date.now();
  }

  return response;
};

export const answer = (response: ResponseBody, callbacks: Callbacks) => {
  const { req_id, req_timestamp, res_timestamp, result, error } = response;
  if (!callbacks[req_id]) {
    console.error(`Callback for req_id ${req_id} has been called, ignored.`);
    return;
  }
  if (Object.prototype.hasOwnProperty.call(response, 'result')) {
    callbacks[req_id][0]({
      result,
      req_timestamp,
      res_timestamp,
    });
  } else if (Object.prototype.hasOwnProperty.call(response, 'error')) {
    callbacks[req_id][1]({
      error,
      req_timestamp,
      res_timestamp,
    });
  }
  callbacks[req_id] = null;
};
