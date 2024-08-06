import { contextBridge, ipcRenderer } from 'electron';
import { ERROR, EVENT, M2R_MAIN_WORLD_NAME } from '../dictionary';
import { isValidName } from '../validater';

export default function register() {
  let handlers: Handlers = {};

  ipcRenderer.on(EVENT.M2R_QUESTION, async (event, message) => {
    const { method, params, req_id, req_timestamp } = message;
    let result = null;
    if (!handlers[method]) {
      return ipcRenderer.send(EVENT.M2R_ANSWER, {
        jsonrpc: '2.0',
        error: ERROR.METHOD_NOT_FOUND,
        req_id,
        req_timestamp,
        res_timestamp: Date.now(),
      });
    }
    try {
      result = await handlers[method](params);
      ipcRenderer.send(EVENT.M2R_ANSWER, {
        jsonrpc: '2.0',
        result,
        req_id,
        req_timestamp,
        res_timestamp: Date.now(),
      });
    } catch (error) {
      ipcRenderer.send(EVENT.M2R_ANSWER, {
        jsonrpc: '2.0',
        error,
        req_id,
        req_timestamp,
        res_timestamp: Date.now(),
      });
    }
  });
  function register(methods: Handlers) {
    Object.keys(methods).forEach((method) => {
      if (handlers[method]) {
        console.error(`Method name "${method}" has been registered, ignored.`);
      } else if (isValidName(method)) {
        handlers[method] = methods[method];
      } else {
        console.error(`Invalid method name: ${method}, ignored.`);
      }
    });
  }

  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld(M2R_MAIN_WORLD_NAME, { register });
  } else {
    // @ts-ignore
    window[M2R_MAIN_WORLD_NAME] = { register };
  }
};
