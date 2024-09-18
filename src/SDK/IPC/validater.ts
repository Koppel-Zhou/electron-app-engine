import { ERROR } from './dictionary';

// 正则表达式：匹配合法的变量名
const validNamePattern = /^[a-zA-Z_$][a-zA-Z0-9_.$]*$/;
const reserved = ['$'];

export const isValidName = (name: string) => validNamePattern.test(name);

export const registerWithErrorHandler = (methods: Handlers, handlers: Handlers) => {
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
export const requestWithErrorHandler = async (
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

export const answerWithErrorHandler =
  (callback: [Function, Function]) => (response: ResponseBody) => {
    const [resolve, reject] = callback || [];
    if (!(resolve instanceof Function) || !(reject instanceof Function)) {
      console.error(
        `Callback for req_id "${response?.req_id}" dose not exists, ignored.`,
      );
      return 0;
    }
    if (Object.prototype.hasOwnProperty.call(response, 'result')) {
      resolve(response);
    } else if (Object.prototype.hasOwnProperty.call(response, 'error')) {
      reject(response);
    }
  };
