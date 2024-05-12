import { ipcMain } from 'electron';
import logger from 'electron-log';
import {
  method_keys as app_methods_keys,
  methods as app_methods,
} from '../NativeAPI/app';

interface Methods {
  [key: string]: Function;
}

const methods: Methods = {};

app_methods_keys.forEach((method) => {
  const app_method = `app.${method}`;
  methods[app_method] = app_methods[method];
});
const start = () => {
  ipcMain.handle('json-rpc-message', (event, message) => {
    logger.info('json-rpc-message', message);
    const { method, params } = JSON.parse(message);
    const result = methods[method](params);
    logger.info(`${method} result`, result);
    return result;
  });
};

export default {
  start,
};
