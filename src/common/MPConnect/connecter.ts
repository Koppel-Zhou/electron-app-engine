import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ERROR } from './constants';

interface Handlers {
  [key: string]: Function
}

interface Callbacks {
  [key: string]: Function
}

type Target = string | number | Array<string | number>;


export function connectWorker() {
  // 注册的远程调用处理器
  const handlers: Handlers = {};
  // 等待回调调用的resolver队列
  const callbacks: Callbacks = {};

  // 请求主进程向加载此preload的窗口发送一个通道
  // 以便此窗口可以用它与 Worker 进程建立通信
  ipcRenderer.send('request-worker-channel')
  
  ipcRenderer.once('provide-worker-channel', (event: IpcRendererEvent, self_id: string | number) => {
    const [ port ] = event.ports
    const WORKER_PORT = {
      register: (method: string, handler: Function) => {
        handlers[method] = handler;
      },
      request: async (method: string, params: Object, target: Target) => {
        let req_id = crypto.randomUUID();
        port.postMessage({
          jsonrpc: '2.0',
          method,
          params,
          target,
          id: self_id,
          req_id,
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
    port.onmessage = async (event: MessageEvent) => {
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
      } = event.data;

      // 作为服务端，响应method调用
      if (method) {
        if (!handlers[method]) {
          return port.postMessage({
            jsonrpc: '2.0',
            error: ERROR.METHOD_NOT_FOUND,
            target: id,
            id: target,
            req_id,
          });
        }

        try {
          const result = await handlers[method](params);
          return port.postMessage({
            jsonrpc: '2.0',
            result,
            target: id,
            id: target,
            req_id,
          });
        } catch (err) {
          return port.postMessage({
            jsonrpc: '2.0',
            error: { ...ERROR.SERVER_ERROR, data: err },
            target: id,
            id: target,
            req_id,
          });
        }
      }

      // 作为客户端，接收 result/error 并影响给注册者
      if (result || error) {
        callbacks[req_id]({ result, error })
      }
    }
  })
}