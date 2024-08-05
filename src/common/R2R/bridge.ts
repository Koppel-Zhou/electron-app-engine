import path from 'path';
import {
  app,
  BrowserWindow,
  ipcMain,
  IpcMainEvent,
  MessageChannelMain,
} from 'electron';
import logger from 'electron-log';
import { resolveHtmlPath } from '../../utils';
import WindowMG from '../../main/WindowManager';
import { ERROR, EVENT, R2R_REPEATER_TYPE } from '../dictionary';

let worker: BrowserWindow | string | null = null;

export default async function register(
  options: RegisterOptions = {},
) {
  // 仅允许注册一次
  if (worker) {
    return;
  }

  const isMP = options?.repeater === R2R_REPEATER_TYPE.MP;

  if (isMP) {
    worker = new BrowserWindow({
      show: !app.isPackaged,
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        preload: app.isPackaged
          ? path.join(__dirname, 'worker.preload.js')
          : path.join(__dirname, '../../../.engine/dll/worker.preload.js'),
      },
    });

    worker.on('closed', () => {
      worker = null;
    });

    logger.info(resolveHtmlPath('worker.html'));
    await worker.loadURL(resolveHtmlPath('worker.html'));
    worker.webContents.openDevTools();
  }

  // 监听渲染进程请求Worker进程通信频道端口
  ipcMain.on(EVENT.R2R_INIT_BRIDGE, (event: IpcMainEvent) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    const win_id = WindowMG.getWindowNameById(win?.id) || win?.id;

    if (isMP) {
      // 建立新通道
      const { port1, port2 } = new MessageChannelMain();
      win?.on('closed', () => {
        (worker as BrowserWindow).webContents.postMessage(EVENT.R2R_UNREGISTER, win_id);
      });
      // ... 将其中一个端口发送给 Worker
      (worker as BrowserWindow).webContents.postMessage(EVENT.R2R_REGISTER, win_id, [port1]);
      // ... 将另一个端口发送给窗口
      event.senderFrame.postMessage(EVENT.R2R_SET_WINDOW_NAME, win_id, [port2]);
      // 现在窗口和工作进程可以直接相互通信，无需经过主进程！
    } else {
      // 仅注册一次监听事件
      if (!worker) {
        ipcMain.on(
          EVENT.R2R_QUESTION,
          (event, args) => {
            require('electron-log').info('worker receive question', args);
            const { from, target, req_id, req_timestamp } = args;
            let targetWindow = WindowMG.windows.get(target);
            if (!targetWindow || targetWindow.isDestroyed()) {
              WindowMG.windows
              .get(from)
              ?.webContents.send(EVENT.R2R_ANSWER, {
                jsonrpc: '2.0',
                error: ERROR.TARGET_NOT_FOUND,
                target: from,
                from: R2R_REPEATER_TYPE.IPC,
                req_id,
                req_timestamp,
                res_timestamp: Date.now(),
              });
            }
            WindowMG.windows
              .get(target)
              ?.webContents.send(EVENT.R2R_ANSWER, args);
          });
      }
      event.sender.send(EVENT.R2R_SET_WINDOW_NAME, win_id);
      worker = 'browser';
    }
  });
}
