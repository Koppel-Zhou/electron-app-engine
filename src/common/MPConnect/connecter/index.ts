import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ERROR } from '../constants';

export function connectWorker() {
  // 注册的远程调用处理器
  const handlers: Handlers = {};
  // 等待回调调用的resolver队列
  const callbacks: Callbacks = {};

  // 请求主进程向加载此preload的窗口发送一个通道
  // 以便此窗口可以用它与 Worker 进程建立通信
  ipcRenderer.send('__init-bridge__')
  
  ipcRenderer.once('__set-window-name__', (workerEvent: IpcRendererEvent, self_id: string | number) => {
    const [port] = workerEvent.ports;
    const isMP = !!port;
    const requestMethod = isMP
      ? (message: any) => port.postMessage(message)
      : (message: any) => ipcRenderer.send('__message__', message);
    const createServer = isMP
      ? (listener: Function) => port.onmessage = event => listener(event.data)
      : (listener: Function) => ipcRenderer.on('__repeater-message__', (event, data) => listener(data))

    const WORKER_PORT = {
      register: (method: string, handler: Function) => {
        handlers[method] = handler;
      },
      request: async (method: string, params: Object, target: Target, req_timestamp: number) => {
        let req_id = crypto.randomUUID();
        requestMethod({
          jsonrpc: '2.0',
          method,
          params,
          target,
          id: self_id,
          req_id,
          req_timestamp: req_timestamp || Date.now(),
        })
        
        return new Promise((resolve, _reject) => {
          callbacks[req_id] = resolve;
        })
      }
    }
    if (process.contextIsolated) {
      contextBridge.exposeInMainWorld('WORKER_PORT', WORKER_PORT);
    } else {
      // @ts-ignore
      window.WORKER_PORT = WORKER_PORT;
    }

    createServer(async (data) => {
      console.log('>>>>> listener', data)
      const {
        // 作为服务端接收到的请求
        method,
        params,
        // 作为服务端时，target === self_id 为 true
        target,
        // 作为服务端时，id 为请求方的id
        id,
        // 作为客户端接收到的响应
        result,
        error,
        req_id,
        req_timestamp,
      } = data;

      // 作为服务端，响应method调用
      if (method) {
        if (!handlers[method]) {
          return requestMethod({
            jsonrpc: '2.0',
            error: ERROR.METHOD_NOT_FOUND,
            target: id,
            id: target,
            req_id,
            req_timestamp,
            res_timestamp: Date.now(),
          });
        }

        try {
          const result = await handlers[method](params);
          return requestMethod({
            jsonrpc: '2.0',
            result,
            target: id,
            id: target,
            req_id,
            req_timestamp,
            res_timestamp: Date.now(),
          });
        } catch (err) {
          return requestMethod({
            jsonrpc: '2.0',
            error: { ...ERROR.SERVER_ERROR, data: err },
            target: id,
            id: target,
            req_id,
            req_timestamp,
            res_timestamp: Date.now(),
          });
        }
      }

      // 作为客户端，接收 result/error 并影响给注册者
      if (result || error) {
        callbacks[req_id](data)
      }
    })
  })
}