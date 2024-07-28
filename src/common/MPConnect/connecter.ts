import { contextBridge, ipcRenderer } from 'electron';

export function connectWorker() {
  // 请求主进程向加载此preload的窗口发送一个通道
  // 以便此窗口可以用它与 Worker 进程建立通信
  console.info('>>>>> renderer request-worker-channel');
  ipcRenderer.send('request-worker-channel')
  
  console.info('>>>>> renderer once provide-worker-channel');
  ipcRenderer.once('provide-worker-channel', (event) => {
    // 一旦收到回复, 我们可以这样做...
    const [ port ] = event.ports
    // ... 注册一个接收结果处理器 ...
    console.log('>>>>> process.contextIsolated', process.contextIsolated);
    if (process.contextIsolated) {
      // contextIsolated渲染进程安全的API调用方式
      contextBridge.exposeInMainWorld('FE_WORKER_PORT', {
        postMessage: (message: any) => port.postMessage(message),
        onmessage: (callback: (this: MessagePort, ev: MessageEvent<any>) => any) => port.onmessage = callback
      });
    } else {
      // @ts-ignore
      window.FE_WORKER_PORT = port;
    }
    port.onmessage = (event) => {
      console.log('renderer port onmessage received result:', event.data)
    }
    // ... 并开始发送消息给 worker 进程!
    port.postMessage(21)
  })
}