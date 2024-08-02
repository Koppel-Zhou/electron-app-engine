import { ipcRenderer } from 'electron';
import { method_keys as app_method_keys } from '../NativeAPI/app';
import { EVENT } from '../dictionary';

type MethodSet = {
  [key: string]: Function | MethodSet;
};

const methods: MethodSet = {};

function register(method_keys: string[]) {
  method_keys.forEach((method: string) => {
    const keys = method.split('.');
    keys.reduce((acc, key, index) => {
      if (index === keys.length - 1) {
        acc[key] = (params: any) => {
          console.log(`[NativeAPI] Call ${method} with params: ${params}`);
          return ipcRenderer.invoke(
            EVENT.R2M_MESSAGE,
            method,
            JSON.stringify(params),
            Date.now(),
          );
        };
      } else {
        acc[key] = acc[key] || {};
      }
      return acc[key];
    }, methods);
  });
}

register(app_method_keys);

export default methods;
