import { contextBridge, ipcRenderer } from 'electron';
import { method_keys as app_method_keys } from '../../NativeAPI/app';
import { ERROR, EVENT, R2M_MAIN_WORLD_NAME } from '../dictionary';

export default function register() {
  const methods: MethodSet = {};

  async function realCall({ method, params, req_timestamp }: RequestBody) {
    return new Promise((resolve, reject) => {
      const req_time = req_timestamp || Date.now();
      const req_id = crypto.randomUUID();
      console.log(`[NativeAPI] Call ${method} with params: ${params}`);
      ipcRenderer
        .invoke(EVENT.R2M_MESSAGE, {
          method,
          params,
          req_id,
          req_timestamp: req_time,
        })
        .then((response) => {
          const {
            result,
            error,
            req_id: res_req_id,
            req_timestamp: res_req_time,
            res_timestamp,
          } = response;
          if (result) {
            resolve({
              result,
              req_id: res_req_id,
              req_timestamp: res_req_time,
              res_timestamp,
            });
          }
          if (error) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
              error,
              req_id: res_req_id,
              req_timestamp: res_req_time,
              res_timestamp,
            });
          }
          return 0;
        })
        .catch((e) => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({
            error: { ...ERROR.SERVER_ERROR, data: e },
            req_id,
            req_timestamp: req_time,
            res_timestamp: Date.now(),
          });
        });
    });
  }

  // 调用方式一
  const $ = async ({ method, params, req_timestamp }: RequestBody) => {
    return realCall({ method, params, req_timestamp });
  };

  function exportMethods(method_keys: string[]) {
    method_keys.forEach((method: string) => {
      const keys = method.split('.');
      keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
          acc[key] = async (params: any, req_timestamp: number) => {
            return realCall({ method, params, req_timestamp });
          };
        } else {
          acc[key] = acc[key] || {};
        }
        return acc[key];
      }, methods);
    });
  }

  exportMethods(app_method_keys);

  const method_set = {
    $,
    ...methods,
  }

  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld(R2M_MAIN_WORLD_NAME, method_set);
  } else {
    // @ts-ignore
    window[R2M_MAIN_WORLD_NAME] = method_set;
  }
}
