import { contextBridge, ipcRenderer } from 'electron';
import { EVENT, M2R_MAIN_WORLD_NAME } from '../dictionary';
import { callValidater, registerValidater } from '../validater';

export default function start() {
  let handlers: Handlers = {};

  ipcRenderer.on(EVENT.M2R_QUESTION, async (event, message) => {

    const isNotice = !message?.req_id;

    if (isNotice) {
      callValidater(message, handlers);
      return 0;
    }

    const response = await callValidater(message, handlers);
    ipcRenderer.send(EVENT.M2R_ANSWER, response);
    // let result = null;
    // if (!handlers[method]) {
    //   return ipcRenderer.send(EVENT.M2R_ANSWER, {
    //     jsonrpc: '2.0',
    //     error: ERROR.METHOD_NOT_FOUND,
    //     req_id,
    //     req_timestamp,
    //     res_timestamp: Date.now(),
    //   });
    // }
    // try {
    //   result = await handlers[method](params);
    //   ipcRenderer.send(EVENT.M2R_ANSWER, {
    //     jsonrpc: '2.0',
    //     result,
    //     req_id,
    //     req_timestamp,
    //     res_timestamp: Date.now(),
    //   });
    // } catch (error) {
    //   ipcRenderer.send(EVENT.M2R_ANSWER, {
    //     jsonrpc: '2.0',
    //     error: { ...ERROR.SERVER_ERROR, data: error },
    //     req_id,
    //     req_timestamp,
    //     res_timestamp: Date.now(),
    //   });
    // }
  });
  function register(methods: Handlers) {
    registerValidater(methods, handlers);
  }

  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld(M2R_MAIN_WORLD_NAME, { register });
  } else {
    // @ts-ignore
    window[M2R_MAIN_WORLD_NAME] = { register };
  }
};
