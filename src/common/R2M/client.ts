import { contextBridge, ipcRenderer } from 'electron';
import { method_keys as app_method_keys } from '../NativeAPI/app';
import { EVENT, R2M_MAIN_WORLD_NAME } from '../dictionary';

export default function register() {
  const methods: MethodSet = {};

  // 调用方式一
  const $ = async ({ method, params, req_timestamp }: RequestBody) => {
    console.log(`[NativeAPI] Call ${method} with params: ${params}`);
    const response = await ipcRenderer.invoke(
      EVENT.R2M_MESSAGE,
      method,
      params,
      // JSON.stringify(params),
      req_timestamp || Date.now(),
    );

    const {
      result,
      error,
      req_timestamp: res_req_time,
      res_timestamp,
    } = response;
    if (result) {
      return Promise.resolve({
        result,
        req_timestamp: res_req_time,
        res_timestamp,
      });
    }
    if (error) {
      return Promise.reject({
        error,
        req_timestamp: res_req_time,
        res_timestamp,
      });
    }
  };

  function registerMethods(method_keys: string[]) {
    method_keys.forEach((method: string) => {
      const keys = method.split('.');
      keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
          acc[key] = async (params: any) => {
            console.log(`[NativeAPI] Call ${method} with params: ${params}`);
            const response = await ipcRenderer.invoke(
              EVENT.R2M_MESSAGE,
              method,
              params,
              // JSON.stringify(params),
              Date.now(),
            );

            const { result, error, req_timestamp, res_timestamp } = response;
            if (result) {
              return Promise.resolve({
                result,
                req_timestamp,
                res_timestamp,
              });
            }
            if (error) {
              return Promise.reject({
                error,
                req_timestamp,
                res_timestamp,
              });
            }
          };
        } else {
          acc[key] = acc[key] || {};
        }
        return acc[key];
      }, methods);
    });
  }

  registerMethods(app_method_keys);

  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld(R2M_MAIN_WORLD_NAME, {
      $,
      ...methods,
    });
  } else {
    // @ts-ignore
    window[R2M_MAIN_WORLD_NAME] = methods;
  }
}
