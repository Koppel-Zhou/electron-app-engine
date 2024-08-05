import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ERROR, EVENT, R2R_MAIN_WORLD_NAME } from '../dictionary';
import { isValidName } from '../validater';

export default function connect() {
  // 注册的远程调用处理器
  const handlers: Handlers = {};
  // 等待回调调用的resolver队列
  const callbacks: Callbacks = {};

  // 请求主进程向加载此preload的窗口发送一个通道
  // 以便此窗口可以用它与 Worker 进程建立通信
  ipcRenderer.send(EVENT.R2R_INIT_BRIDGE);

  ipcRenderer.once(
    EVENT.R2R_SET_WINDOW_NAME,
    (workerEvent: IpcRendererEvent, self_id: string | number) => {
      const [port] = workerEvent.ports;
      const isMP = !!port;
      const requestMethod = isMP
        ? (message: any) => port.postMessage(message)
        : (message: any) => ipcRenderer.send(EVENT.R2R_QUESTION, message);
      const createServer = isMP
        ? (listener: Function) =>
            (port.onmessage = (event) => listener(event.data))
        : (listener: Function) =>
            ipcRenderer.on(EVENT.R2R_ANSWER, (event, data) => listener(data));

      const WORKER_PORT = {
        register: (methods: Handlers) => {
          Object.keys(methods).forEach((method) => {
            if (handlers[method]) {
              console.error(
                `Method name "${method}" has been registered, ignored.`,
              );
            } else if (isValidName(method)) {
              handlers[method] = methods[method];
            } else {
              console.error(`Invalid method name: ${method}, ignored.`);
            }
          });
        },
        request: async ({
          method,
          params,
          target,
          req_timestamp,
        }: RequestBody) => {
          const req_id = crypto.randomUUID();
          requestMethod({
            jsonrpc: '2.0',
            method,
            params,
            target,
            from: self_id,
            req_id,
            req_timestamp: req_timestamp || Date.now(),
          });

          return new Promise((resolve, _reject) => {
            callbacks[req_id] = resolve;
          });
        },
      };
      if (process.contextIsolated) {
        contextBridge.exposeInMainWorld(R2R_MAIN_WORLD_NAME, WORKER_PORT);
      } else {
        // @ts-ignore
        window[R2R_MAIN_WORLD_NAME] = WORKER_PORT;
      }

      createServer(async (data: ProtocolRequest | ProtocolResponse) => {
        const {
          // 作为服务端接收到的请求
          method,
          params,
          // 作为服务端时，target === self_id 为 true
          target,
          // 作为服务端时，id 为请求方的id
          from,
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
              target: from,
              from: target,
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
              target: from,
              from: target,
              req_id,
              req_timestamp,
              res_timestamp: Date.now(),
            });
          } catch (err) {
            return requestMethod({
              jsonrpc: '2.0',
              error: { ...ERROR.SERVER_ERROR, data: err },
              target: from,
              from: target,
              req_id,
              req_timestamp,
              res_timestamp: Date.now(),
            });
          }
        }

        // 作为客户端，接收 result/error 并影响给注册者
        if (result || error) {
          callbacks[req_id](data);
        }
      });
    },
  );
}
