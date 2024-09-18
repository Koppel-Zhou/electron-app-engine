import crypto from 'crypto';
import { BrowserWindow, ipcMain, webContents } from 'electron';
import { ERROR, EVENT } from '../dictionary';
import { answerWithErrorHandler } from '../validater';

const callbacks: Callbacks = {};

ipcMain.on(EVENT.M2R_ANSWER, (event, res: ResponseBody) => {
  answerWithErrorHandler(callbacks[res?.req_id])(res);
  callbacks[res?.req_id] = null;
  // const { req_id, result, error, req_timestamp, res_timestamp } = res;
  // if (result) {
  //   callbacks[req_id][0]({ result, req_timestamp, res_timestamp });
  // } else if (error) {
  //   callbacks[req_id][1]({ error, req_timestamp, res_timestamp });
  // }

  // callbacks[req_id] = null;
});

export function request({
  method,
  params,
  target,
  req_timestamp,
}: RequestBody) {
  const req_id = crypto.randomUUID();
  const targetWindow = BrowserWindow.fromWebContents(
    webContents.fromId(target),
  );
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

function noticeTarget({ method, params, target, req_timestamp }: RequestBody) {
  const targetWindow = BrowserWindow.fromWebContents(
    webContents.fromId(target),
  );
  if (!targetWindow || targetWindow.isDestroyed()) {
    console.error(`The target window ${target} is not found.`);
    return 0;
  }
  targetWindow?.webContents.send(EVENT.M2R_QUESTION, {
    jsonrpc: '2.0',
    method,
    params,
    req_timestamp: req_timestamp || Date.now(),
  });
}

export function notice({ method, params, target, req_timestamp }: RequestBody) {
  if (Array.isArray(target)) {
    target.forEach((windowWebContentsId) => {
      noticeTarget({
        method,
        params,
        target: windowWebContentsId,
        req_timestamp,
      });
    });
  } else {
    noticeTarget({ method, params, target, req_timestamp });
  }
}
