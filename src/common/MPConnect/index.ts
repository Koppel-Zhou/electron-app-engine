import path from 'path';
import { app, BrowserWindow, ipcMain, IpcMainEvent, MessageChannelMain } from 'electron';
import logger from 'electron-log';
import { resolveHtmlPath } from '../../utils';
import WindowMG from '../../main/WindowManager';

let worker: BrowserWindow | string | null = null;

export async function registerWorkerBeforeAllWidow({ repeater } = { repeater: 'IPC' }) {
  // 仅允许注册一次
  if (worker) {
    return;
  }

  const isMP = repeater === 'MESSAGE_PORT';
  const isIPC = repeater === 'IPC';

  if (isMP) {
    worker = new BrowserWindow({
      show: !app.isPackaged,
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        preload: app.isPackaged
        ? path.join(__dirname, 'worker.preload.js')
        : path.join(__dirname, '../../../.engine/dll/worker.preload.js'), },
    });
    
    worker.on('closed', () => {
      worker = null;
    })

    logger.info(resolveHtmlPath('worker.html'));
    await worker.loadURL(resolveHtmlPath('worker.html'));
    worker.webContents.openDevTools();
  }

  // 监听渲染进程请求Worker进程通信频道端口
  ipcMain.on('__init-bridge__', (event: IpcMainEvent) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    const win_id = WindowMG.getWindowNameById(win?.id) || win?.id;

    if (isMP) {
      // 建立新通道
      const { port1, port2 } = new MessageChannelMain();
      // ... 将其中一个端口发送给 Worker
      (worker as BrowserWindow).webContents.postMessage('__register-worker-port__', win_id, [port1])
      // ... 将另一个端口发送给窗口
      event.senderFrame.postMessage('__set-window-name__', win_id, [port2])
      // 现在窗口和工作进程可以直接相互通信，无需经过主进程！
    } else {
      // 仅注册一次监听事件
      if (!worker) {
        ipcMain.on('__message__', (event, args) => new Promise<void>((resolve, reject) => {
          const { target } = args;
          WindowMG.windows.get(target)?.webContents.send('__repeater-message__', args);
        }));
      }
      event.sender.send('__set-window-name__', win_id);
      worker = 'browser';
    }
  })
};