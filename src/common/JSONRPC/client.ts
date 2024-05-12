import { ipcRenderer } from 'electron';

import { method_keys as APP_API } from '../NativeAPI/app';

type MethodSet = {
  [key: string]: Function | MethodSet;
};

const methods: MethodSet = { app: {} };
APP_API.forEach((method: string) => {
  const app_method = `app.${method}`;
  (methods.app as MethodSet)[method] = (params: any) => {
    console.log(`[NativeAPI] ${app_method}`, params);
    return ipcRenderer.invoke(
      'json-rpc-message',
      JSON.stringify({ method: app_method, params }),
    );
  };
});

export default methods;
