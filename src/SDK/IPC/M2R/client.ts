import crypto from 'crypto';
import { ipcMain } from 'electron';
import { ERROR, EVENT } from '../dictionary';
import WindowMG from '../../../main/WindowManager';
import { answer } from '../validater';

const callbacks: Callbacks = {};

ipcMain.on(EVENT.M2R_ANSWER, (event, res: ResponseBody) => {
  answer(res, callbacks);
  // const { req_id, result, error, req_timestamp, res_timestamp } = res;
  // if (result) {
  //   callbacks[req_id][0]({ result, req_timestamp, res_timestamp });
  // } else if (error) {
  //   callbacks[req_id][1]({ error, req_timestamp, res_timestamp });
  // }

  // callbacks[req_id] = null;
});

export default function request({
  method,
  params,
  target,
  req_timestamp,
}: RequestBody) {
  const req_id = crypto.randomUUID();
  const targetWindow = WindowMG.windows.get(target);
  if (!targetWindow || targetWindow.isDestroyed()) {
    return Promise.resolve({
      jsonrpc: '2.0',
      error: ERROR.TARGET_NOT_FOUND,
      req_id,
      req_timestamp: req_timestamp || Date.now(),
      res_timestamp: Date.now(),
    });
  }

  targetWindow?.webContents.send(EVENT.M2R_QUESTION, {
    jsonrpc: '2.0',
    method,
    params,
    req_id,
    req_timestamp: req_timestamp || Date.now(),
  });

  return new Promise((resolve, reject) => {
    callbacks[req_id] = [resolve, reject];
  });
}
