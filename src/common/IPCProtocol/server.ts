import { IpcMainInvokeEvent, ipcMain } from 'electron';
import { ERROR, EVENT } from '../dictionary';

const r2mHandlers: Handlers = {};

const ipcHandler = (
  _event: IpcMainInvokeEvent,
  method: string,
  params: string,
  req_timestamp: number,
) => {
  try {
    const method_func = r2mHandlers[method];

    if (!(method_func instanceof Function)) {
      return {
        jsonrpc: '2.0',
        error: ERROR.METHOD_NOT_FOUND,
        req_timestamp,
        res_timestamp: Date.now(),
      };
    }
    let params_obj = {};

    try {
      params_obj = typeof params === 'string' ? JSON.parse(params) : params;
    } catch (e) {
      return {
        jsonrpc: '2.0',
        error: ERROR.PARSE_ERROR,
        req_timestamp,
        res_timestamp: Date.now(),
      };
    }

    const result = r2mHandlers[method](params_obj);

    return {
      jsonrpc: '2.0',
      result,
      req_timestamp,
      res_timestamp: Date.now(),
    };
  } catch (e) {
    return {
      jsonrpc: '2.0',
      error: ERROR.SERVER_ERROR,
      req_timestamp,
      res_timestamp: Date.now(),
    };
  }
};

ipcMain.handle(EVENT.R2M_MESSAGE, ipcHandler);

export default function register(handlers: Handlers) {
  Object.keys(handlers).forEach((method_key) => {
    r2mHandlers[method_key] = handlers[method_key];
  });
}
