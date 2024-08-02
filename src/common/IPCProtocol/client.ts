import { ipcRenderer } from 'electron';
import { method_keys as APP_API } from '../NativeAPI/app';
import { EVENT } from '../dictionary';

type MethodSet = {
  [key: string]: Function | MethodSet;
};

const methods: MethodSet = { app: {} };
APP_API.forEach((method) => {
  const app_method = `app.${method}`;
  (methods.app as MethodSet)[method] = (params: any) => {
    console.log(`[NativeAPI] Call ${app_method} with params: ${params}`);
    return ipcRenderer.invoke(
      EVENT.R2M_MESSAGE,
      app_method,
      JSON.stringify(params),
      Date.now(),
    );
  };
});

export default methods;
