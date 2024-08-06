import crypto from 'crypto';
import { ipcMain } from 'electron';
import { ERROR, EVENT } from '../dictionary';
import WindowMG from '../../main/WindowManager';

let callbacks: Callbacks = {};

ipcMain.on(EVENT.M2R_ANSWER, (event, res: ResponseBody) => {
  const { req_id } = res;
  callbacks[req_id](res);
})

export const request = ({
  method,
  params,
  target,
  req_timestamp
}: RequestBody) => {
  const req_id = crypto.randomUUID();
  const targetWindow = WindowMG.windows.get(target);
  if (!targetWindow || targetWindow.isDestroyed()) {
    return Promise.resolve({
      jsonrpc: '2.0',
      error: ERROR.TARGET_NOT_FOUND,
      req_id,
      req_timestamp: req_timestamp || Date.now(),
      res_timestamp: Date.now(),
    })
  }

  targetWindow?.webContents.send(EVENT.M2R_QUESTION, {
    jsonrpc: '2.0',
    method,
    params,
    req_id,
    req_timestamp: req_timestamp || Date.now(),
  });

  return new Promise((resolve, _reject) => {
    callbacks[req_id] = resolve;
  });
};
