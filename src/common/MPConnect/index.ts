import path from 'path';
import { app, BrowserWindow, ipcMain, IpcMainEvent, MessageChannelMain } from 'electron';
import logger from 'electron-log';
import { resolveHtmlPath } from '../../utils';
let worker: BrowserWindow = null;

export async function registerWorkerBeforeAllWidow() {
  if (worker) {
    return;
  }
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

  // 监听渲染进程请求Worker进程通信频道端口
  ipcMain.on('request-worker-channel', (event: IpcMainEvent) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    const win_id = win?.id;
    // 建立新通道
    const { port1, port2 } = new MessageChannelMain()
    // ... 将其中一个端口发送给 Worker
    worker.webContents.postMessage('new-client', win_id, [port1])
    // ... 将另一个端口发送给窗口
    event.senderFrame.postMessage('provide-worker-channel', win_id, [port2])
    // 现在窗口和工作进程可以直接相互通信，无需经过主进程！
  })
};
