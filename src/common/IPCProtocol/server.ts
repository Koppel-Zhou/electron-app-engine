import { IpcMainInvokeEvent, ipcMain } from 'electron';
import {
  method_keys as app_methods_keys,
  methods as app_methods,
} from '../NativeAPI/app';
import {
  INTERNAL_ERROR,
  INVALID_PARAMS,
  METHOD_NOT_FOUND,
  PARSE_ERROR,
} from './error';
import { IPCError, IPCResponse } from './tools';

interface Methods {
  [key: string]: Function;
}

const methods: Methods = {};

app_methods_keys.forEach((method) => {
  const app_method = `app.${method}`;
  methods[app_method] = app_methods[method];
});

const ipcHandler: (
  event: IpcMainInvokeEvent,
  method: string,
  params: string,
  req_timestamp: number,
) => IPCError | IPCResponse = (
  _event: IpcMainInvokeEvent,
  method: string,
  params: string,
  _req_timestamp: number,
) => {
  try {
    const method_func = methods[method];

    if (!(method_func instanceof Function)) {
      return new IPCError(METHOD_NOT_FOUND);
    }
    let params_obj = {};

    try {
      params_obj = typeof params === 'string' ? JSON.parse(params) : params;
    } catch (e) {
      return new IPCError(PARSE_ERROR);
    }

    const result = methods[method](params_obj);

    return new IPCResponse(result);
  } catch (e) {
    return new IPCError(INTERNAL_ERROR);
  }
};

const start = () => {
  ipcMain.handle('json-ipc-message', ipcHandler);
};

export default {
  start,
};
