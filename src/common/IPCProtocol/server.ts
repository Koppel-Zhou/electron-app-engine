import { IpcMainInvokeEvent, ipcMain } from 'electron';
import {
  method_keys as app_methods_keys,
  methods as app_methods,
} from '../NativeAPI/app';
import { ERROR, EVENT } from '../dictionary';

interface Methods {
  [key: string]: Function;
}

const methods: Methods = {};

app_methods_keys.forEach((method) => {
  const app_method = `app.${method}`;
  methods[app_method] = app_methods[method];
});

const ipcHandler = (
  _event: IpcMainInvokeEvent,
  method: string,
  params: string,
  req_timestamp: number,
) => {
  try {
    const method_func = methods[method];

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

    const result = methods[method](params_obj);

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

const start = () => {
  ipcMain.handle(EVENT.R2M_MESSAGE, ipcHandler);
};

export default {
  start,
};
