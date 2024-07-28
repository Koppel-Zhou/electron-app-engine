import path from 'path';
import { app, BrowserWindow, ipcMain, MessageChannelMain } from 'electron';
import logger from 'electron-log';
import { resolveHtmlPath } from '../../utils';

export async function registerWorkerBeforeAllWidow() {
  const worker = new BrowserWindow({
    show: !app.isPackaged,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: app.isPackaged
      ? path.join(__dirname, 'worker.preload.js')
      : path.join(__dirname, '../../../.engine/dll/worker.preload.js'), },
  });

  logger.info(resolveHtmlPath('worker.html'));
  await worker.loadURL(resolveHtmlPath('worker.html'));
  worker.webContents.openDevTools();
  // 在这里我们不能使用 ipcMain.handle() , 因为回复需要传输 MessagePort.
  // 监听从顶级 frame 发来的消息
  logger.info('>>>>> ipcMain on request-worker-channel');
  ipcMain.on('request-worker-channel', (event) => {
    // 建立新通道 ...
    const { port1, port2 } = new MessageChannelMain()
    // ... 将其中一个端口发送给 Worker ...
    logger.info('>>>>> ipcMain send port to worker');
    logger.info(worker.webContents.postMessage);
    worker.webContents.postMessage('new-client', null, [port1])
    // ... 将另一个端口发送给窗口
    logger.info('>>>>> ipcMain send port to renderer');
    event.senderFrame.postMessage('provide-worker-channel', null, [port2])
    // 现在窗口和工作进程可以直接相互通信，无需经过主进程！
  })
};
