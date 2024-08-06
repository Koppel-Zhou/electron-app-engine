import { IpcMainInvokeEvent, ipcMain } from 'electron';
import { EVENT } from '../dictionary';
import { callValidater, registerValidater } from '../validater';

const handlers: Handlers = {};
const ipcHandler = async (_event: IpcMainInvokeEvent, message: RequestBody) => {
  return await callValidater(message, handlers);
  // let params_obj = {};

  // try {
  //   params_obj = typeof params === 'string' ? JSON.parse(params) : params;
  // } catch (e) {
  //   return {
  //     jsonrpc: '2.0',
  //     error: ERROR.PARSE_ERROR,
  //     req_timestamp,
  //     res_timestamp: Date.now(),
  //   };
  // }
  // try {
  //   const method_func = handlers[method];
  //   if (!(method_func instanceof Function)) {
  //     return {
  //       jsonrpc: '2.0',
  //       error: ERROR.METHOD_NOT_FOUND,
  //       req_timestamp,
  //       res_timestamp: Date.now(),
  //     };
  //   }

  //   const result = handlers[method](params);

  //   return {
  //     jsonrpc: '2.0',
  //     result,
  //     req_timestamp,
  //     res_timestamp: Date.now(),
  //   };
  // } catch (e) {
  //   return {
  //     jsonrpc: '2.0',
  //     error: { ...ERROR.SERVER_ERROR, data: e },
  //     req_timestamp,
  //     res_timestamp: Date.now(),
  //   };
  // }
};

ipcMain.handle(EVENT.R2M_MESSAGE, ipcHandler);

export default function register(methods: Handlers) {
  registerValidater(methods, handlers);
}
